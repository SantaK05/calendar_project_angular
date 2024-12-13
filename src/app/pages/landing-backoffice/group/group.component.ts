import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Group, Role, Stato, User } from '../../../interfaces/backoffice';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group',
  imports: [FormsModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupsComponent {
  current: Group = {
    id: 0,
    nome: '',
    utenti: {
      id: 0,
      nome: '',
      cognome: '',
      username: '',
      password: '',
      email: '',
      ruolo: {
        id: 0,
        nome: '',
        descrizione: '',
      },
      gruppo: {
        id: 0,
        nome: '',
        utenti: {} as User,
        ruoli: {} as Role,
      },
      stato: {} as Stato,
    },
    ruoli: {
      id: 0,
      nome: '',
      descrizione: '',
    },
  };

  triggerNavigation: boolean = false;

  constructor(
    private service: GroupService,
    private messageService: MessageService,
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
