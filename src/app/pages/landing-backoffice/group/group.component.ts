import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Group, Role, User } from '../../../interfaces/backoffice';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { GroupService } from '../services/group.service';
import { MessageService } from '../services/message.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-group',
  imports: [FormsModule, CommonModule, NavbarComponent, RouterModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupsComponent {
  avaibleRoles: Role[] = [];
  avaibleUsers: User[] = [];

  current: Group = {
    id: 0,
    nome: '',
    utenti: [],
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

            this.selectedUser = new Set(this.current.utenti.map((u) => u.id));
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

  save() {
    this.current.utenti = this.avaibleUsers.filter((u) =>
      this.selectedUser.has(u.id)
    );

    this.current.ruoli = this.avaibleRoles.filter((r) =>
      this.selectedRole.has(r.id)
    );

    this.service
      .save(this.current)
      .pipe(
        switchMap((response) => {
          return this.service.findAll();
        }),
        tap((data: any) => {
          this.router.navigateByUrl('/backoffice/group-list');
        })
      )
      .subscribe();
  }

  toggleRole(role: Role) {
    if (this.selectedRole.has(role.id)) {
      this.selectedRole.delete(role.id);
    } else {
      this.selectedRole.add(role.id);
    }
  }

  toggleUser(user: User) {
    if (this.selectedUser.has(user.id)) {
      this.selectedUser.delete(user.id);
    } else {
      this.selectedUser.add(user.id);
    }
  }
}
