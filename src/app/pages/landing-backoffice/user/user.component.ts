import { Component, ViewChild } from '@angular/core';
import { Group, Stato, User } from '../../../interfaces/backoffice';
import { Role } from '../../../interfaces/backoffice';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { GroupService } from '../services/group.service';
import { MessageService } from '../services/message.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @ViewChild('errorModal') errorModal: any;

  avaibleRoles: Role[] = [];
  avaibleGroups: Group[] = [];
  groups: any[] = [];
  roles: any[] = [];
  searchTerm: string = '';
  filteredGroups: any[] = [];
  filteredRoles: any[] = [];

  current: User = {
    id: 0,
    nome: '',
    cognome: '',
    username: '',
    password: '',
    email: '',
    ruoli: [],
    gruppi: [],
    stato: Stato.REGISTRAZIONE,
    
  };

  selectedRole: Set<number> = new Set();
  selectedGroup: Set<number> = new Set();
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(
    private service: UserService,
    private messageService: MessageService,
    private groupService: GroupService,
    private roleService: RoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.initializeComponent();
  }

  private initializeComponent() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      console.log(`richiamo il caricamento dell'utente ${id}`);

      this.service
        .load(id)
        .pipe(
          tap((data) => {
            console.log(`ottenuti i dati dell'utente`);
            console.log(data);
            this.current = data as User;

            this.selectedRole = new Set(data.ruoli.map((ruolo) => ruolo.id));
            this.selectedGroup = new Set(
              data.gruppi.map((gruppo) => gruppo.id)
            );
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError(`Errore caricamento dati.`);

            return throwError(() => err);
          })
        )
        .subscribe();
    }

    this.roleService.findAll().subscribe((data) => {
      this.avaibleRoles = data;
    });

    this.groupService.findAll().subscribe((data) => {
      this.avaibleGroups = data;
    });
  }

  save() {

    if (
      this.current.nome == '' ||
      this.current.cognome == '' ||
      this.current.username == '' ||
      this.current.password == '' ||
      this.current.email == '' ||
      this.current.gruppi == null||
      this.current.ruoli == null
    ) {
      this.messageService.publishError('Errore salvataggio dati.');
      return;
    }
    this.current.ruoli = this.avaibleRoles.filter((role) =>
      this.selectedRole.has(role.id)
    );

    this.current.gruppi = this.avaibleGroups.filter((group) =>
      this.selectedGroup.has(group.id)
    );

    this.service
      .save(this.current)
      .pipe(
        catchError((err) => {
          if (err.status == 409) {
            if (err.error.message.includes('username')) {
              this.errorMessage = 'L\'username inserito esiste già nel database. Per favore, scegli un altro username.';
            } else if (err.error.message.includes('email')) {
              this.errorMessage = 'L\'email inserita esiste già nel database. Per favore, scegli un\'altra email.';
            } else {
              this.errorMessage = 'Errore durante il salvataggio dei dati.';
            }
            this.messageService.publishError(this.errorMessage);
            this.modalService.open(this.errorModal);
          } else {
            console.error('Errore durante il salvataggio:', err);
          }
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/backoffice/user-list']);
        }
      });
  }

  toggleRole(role: any) {
    if (role.nome === 'GUEST') {
      this.selectedRole.clear();
      this.selectedRole.add(role.id);
    } else if (role.nome === 'ADMIN') {
      this.selectedRole.clear();
      this.avaibleRoles.forEach(r => {
        if (r.nome !== 'GUEST' && r.nome !== 'OWNER') {
          this.selectedRole.add(r.id);
        }
      });
      this.selectedRole.add(role.id);
    } else if (role.nome === 'OWNER') {
      this.selectedRole.clear();
      this.avaibleRoles.forEach(r => {
        if (r.nome !== 'GUEST') {
          this.selectedRole.add(r.id);
        }
      });
      this.selectedRole.add(role.id);
    } else {
      if (this.selectedRole.has(role.id)) {
        this.selectedRole.delete(role.id);
      } else {
        this.selectedRole.add(role.id);
      }
      const guestRole = this.avaibleRoles.find(r => r.nome === 'GUEST');
      if (guestRole && this.selectedRole.has(guestRole.id)) {
        this.selectedRole.delete(guestRole.id);
      }
    }
  }

  toggleGroup(group: Group) {
    if (this.selectedGroup.has(group.id)) {
      this.selectedGroup.delete(group.id);
    } else {
      this.selectedGroup.add(group.id);
    }
  }

  searchGroups() {
    const term = this.searchTerm.toLowerCase();
    if (term){
      this.filteredGroups = this.avaibleGroups.filter(group => 
        group.nome.toLowerCase().includes(term)
      );
    }else {
      this.filteredGroups = [];
    }
  }

  searchRoles(){
    const term = this.searchTerm.toLowerCase();
    if (term){
      this.filteredRoles = this.avaibleRoles.filter(role => 
        role.nome.toLowerCase().includes(term)
      );
    }else {
      this.filteredRoles = [];
    }
  }
  
}
