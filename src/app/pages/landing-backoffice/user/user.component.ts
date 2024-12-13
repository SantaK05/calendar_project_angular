import { Component } from '@angular/core';
import { Stato, User } from '../../../interfaces/backoffice';
import { Role } from '../../../interfaces/backoffice';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  current: User = {
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
  };

  triggerNavigation: boolean = false;

  constructor(
    private service: UserService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      console.log(`richiamo il caricamento dell'item ${id}`);

      this.service
        .load(id)
        .pipe(
          tap((data) => {
            console.log(`ottenuti i dati dell'item`);
            console.log(data);
            this.current = data as User;
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError(
              `Errore caricamento dati. Contattare l'amministratore`
            );

            return throwError(() => err);
          })
        )
        .subscribe();
    }
  }

  save() {
    this.service
      .save(this.current)
      .pipe(
        switchMap((response) => {
          return this.service.findAll();
        }),
        tap((data: any) => {
          this.router.navigateByUrl('/list-user');
        })
      )
      .subscribe();
  }
}
