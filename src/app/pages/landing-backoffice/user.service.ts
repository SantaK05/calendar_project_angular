import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/backoffice';
import {
  switchMap,
  catchError,
  of,
  merge,
  tap,
  Observable,
  throwError,
} from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  arrayUser: User[] = [];

  BASE_URL = 'http://localhost:8081/user';

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {
    this.findAll().subscribe();
  }

  findAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.BASE_URL}`).pipe(
      tap((data) => {
        console.log(`aggiorno l'elenco degli utenti nel service`);
        this.arrayUser = data as User[];
      }),
      catchError((err) => {
        this.messageService.publishError('Errore find user');
        return throwError(() => err);
      })
    );
  }

  load(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.BASE_URL}/${id}`).pipe(
      catchError((err) => {
        this.messageService.publishError('Errore find single user');
        return throwError(() => err);
      })
    );
  }

  save(current: User): Observable<User> {
    console.log('richiamato metodo save');

    // TODO attenzione: manca la validazione dei dati

    // cerco nella lista se trovo un elemento con lo stesso id
    let user = this.arrayUser.find((e) => e.id == current.id);
    if (user) {
      // devo modificare solo gli attributi dell'oggetto trovato
      user.cognome = current.cognome;
      user.nome = current.nome;
      user.username = current.username;
      user.password = current.password;
      user.email = current.email;
      user.ruolo = current.ruolo;
      user.gruppo = current.gruppo;
      user.stato = current.stato;

      return this.httpClient
        .put<User>(`${this.BASE_URL}/${user.id}`, user)
        .pipe(
          catchError((err) => {
            this.messageService.publishError('Errore modifica user');
            return throwError(() => err);
          })
        );
    } else {
      // devo creare il nuovo oggetto da inserire nella lista
      user = {
        id: 0,
        nome: current.nome,
        cognome: current.cognome,
        username: current.username,
        password: current.password,
        email: current.email,
        ruolo: current.ruolo,
        gruppo: current.gruppo,
        stato: current.stato,
      };
      console.log('inserisco evento di salvataggio');

      return this.httpClient.post<User>(`${this.BASE_URL}`, user).pipe(
        // gestisco gli eventuali errori,
        // ATTENZIONE se non gestiti bene il flusso viene chiuso e non accetterà più nuovi eventi
        catchError((err) => {
          this.messageService.publishError('Errore creazione user');
          return throwError(() => err);
        })
      );
    }
  }

  delete(user: User): Observable<User> | void {
    // devo cercare l'elemento e poi eliminarlo dalla lista
    let index = this.arrayUser.findIndex((e) => e.id == user.id);
    if (index > -1) {
      if (confirm(`Sei sicuro di voler eliminare l'elemento?`)) {
        return this.httpClient.delete<User>(`${this.BASE_URL}/${user.id}`).pipe(
          catchError((err) => {
            this.messageService.publishError('Errore cancellazione user');
            return throwError(() => err);
          })
        );
      }
    } else {
      alert('Nessun elemento trovato nella lista');
    }
  }
}
