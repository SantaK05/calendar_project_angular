import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { GroupService } from '../services/group.service';
import { MessageService } from '../services/message.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';
import { Group, Role, User } from '../../landing-calendario/interfaces/backoffice';

@Component({
  selector: 'app-group',
  imports: [FormsModule, CommonModule, NavbarComponent, RouterModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupsComponent {
  groups: any[] = [];
  avaibleRoles: Role[] = [];
  avaibleUsers: User[] = [];
  searchTerm: string = '';
  filteredUsers: any[] = [];


  current: Group = {
    id: 0,
    nome: '',
    ruoli: [],
  };

  selectedUser: Set<number> = new Set();
  selectedRole: Set<number> = new Set();

  constructor(
    private service: GroupService,
    private messageService: MessageService,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.service
        .load(id)
        .pipe(
          tap((data) => {
            console.log('ottenuti dati gruppo');
            console.log(data);
            this.current = data as Group;
            this.selectedRole = new Set(this.current.ruoli.map((r) => r.id));
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError('Errore caricamento dati.');
            return throwError(() => err);
          })
        )
        .subscribe();
    }

    this.userService.findAll().subscribe((data) => {
      this.avaibleUsers = data;
    });

    this.roleService.findAll().subscribe((data) => {
      this.avaibleRoles = data;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe((data: User[]) => {
      this.groups = data;
      this.filteredUsers = data; // Inizialmente, tutti gli utenti sono mostrati
    });
  }

  save() {
    if (this.current.nome == '' || this.current.ruoli == null) {
      this.messageService.publishError('Errore salvataggio dati.');
      return;
    } else {

    this.current.ruoli = this.avaibleRoles.filter((r) =>
      this.selectedRole.has(r.id)
    );

    this.service
      .save(this.current)
      .pipe(
        tap((response) => {
          console.log('Save response:', response);
        }),
        switchMap(() => this.service.findAll()),
        tap((data: any) => {
          this.router.navigateByUrl('/backoffice/group-list');
        }),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      )
      .subscribe();
    }
  }

  toggleRole(role: any) {
    if (role.nome === 'GUEST') {
      this.selectedRole.clear();
      this.selectedRole.add(role.id);
    } else if (role.nome === 'ADMIN') {
      this.selectedRole.clear();
      this.avaibleRoles.forEach((r) => {
        if (r.nome !== 'GUEST' && r.nome !== 'OWNER') {
          this.selectedRole.add(r.id);
        }
      });
      this.selectedRole.add(role.id);
    } else if (role.nome === 'OWNER') {
      this.selectedRole.clear();
      this.avaibleRoles.forEach((r) => {
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
      const guestRole = this.avaibleRoles.find((r) => r.nome === 'GUEST');
      if (guestRole && this.selectedRole.has(guestRole.id)) {
        this.selectedRole.delete(guestRole.id);
      }
    }
  }

  toggleUser(user: User) {
    if (this.selectedUser.has(user.id)) {
      this.selectedUser.delete(user.id);
    } else {
      this.selectedUser.add(user.id);
    }
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredUsers = this.avaibleUsers.filter(user =>
        user.username.toLowerCase().includes(term)
      );
    } else {
      this.filteredUsers = [...this.avaibleUsers];
    }
  }
}
