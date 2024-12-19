import { Component } from '@angular/core';
import { Group, Stato, User } from '../../../interfaces/backoffice';
import { Role } from '../../../interfaces/backoffice';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { MessageService } from '../message.service';
import { RoleService } from '../role.service';
import { GroupService } from '../group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  avaibleRoles: Role[] = [];
  avaibleGroups: Group[] = [];

  current: User = {
    id: 0,
    nome: '',
    cognome: '',
    username: '',
    password: '',
    email: '',
    ruolo: this.avaibleRoles,
    gruppo: this.avaibleGroups,
    stato: {} as Stato,
  };

  constructor(
    private service: UserService,
    private messageService: MessageService,
    private groupService: GroupService,
    private roleService: RoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      console.log(`richiamo il caricamento dell'utente ${id}`);

      this.service
        .load(id)
        .pipe(
          tap((data) => {
            console.log(`ottenuti i dati dell'utente`);
            console.log(data);
            this.current = data as User;
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError(`Errore caricamento dati.`);

            return throwError(() => err);
          })
        )
        .subscribe();
    }
    this.avaibleRoles = this.roleService.arrayRole;
    this.avaibleGroups = this.groupService.arrayGroup;
  }

  save() {
    this.service
      .save(this.current)
      .pipe(
        switchMap((response) => {
          return this.service.findAll();
        }),
        tap((data: any) => {
          this.router.navigateByUrl('backoffice/user-list');
        })
      )
      .subscribe();
  }
}
