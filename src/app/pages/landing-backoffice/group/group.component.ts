import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Group, Role, Stato, User } from '../../../interfaces/backoffice';
import { GroupService } from '../group.service';
import { RoleService } from '../role.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group',
  imports: [FormsModule, CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupsComponent {
  availableRoles: Role[] = [];
  avaibleUsers: User[] = [];

  current: Group = {
    id: 0,
    nome: '',
    utenti: this.avaibleUsers,
    ruoli: this.availableRoles,
  };

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
            console.log('ottenuti dati ruoli');
            console.log(data);
            this.current = data;
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError('Errore caricamento dati.');
            return throwError(() => err);
          })
        )
        .subscribe();
    }

    this.availableRoles = this.roleService.arrayRole;
    this.avaibleUsers = this.userService.arrayUser;
  }

  save() {
    this.service.save(this.current).pipe(
      switchMap((response) => {
        return this.service.findAll();
      }),
      tap((data: any) => {
        this.router.navigateByUrl('backoffice/group-list');
      })
    );
  }
}
