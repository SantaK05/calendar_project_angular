import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Role } from '../../landing-calendario/interfaces/backoffice';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  arrayRole: Role[] = [];

  BASE_URL = 'http://localhost:8080/backoffice/roles';

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {
    this.findAll().subscribe(); //se non faccio la subscribe non compila
  }

  findAll(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.BASE_URL}`).pipe(
      tap((data) => {
        console.log(`aggiorno l'elenco degli item nel service`);
        this.arrayRole = data as Role[];
      }),
      catchError((err) => {
        this.messageService.publishError('Error for Role');
        return throwError(() => err);
      })
    );
  }

  getRoles(): Role[] {
    return this.arrayRole;
  }

  load(id: string): Observable<Role> {
    return this.httpClient.get<Role>(`${this.BASE_URL}/${id}`).pipe(
      catchError((err) => {
        this.messageService.publishError('Errore find single user');
        return throwError(() => err);
      })
    );
  }

  save(current: Role): Observable<Role> {
    let role = this.arrayRole.find((e) => e.id == current.id);
    if (role) {
      role.nome = current.nome;
      role.descrizione = current.descrizione;

      return this.httpClient
        .put<Role>(`${this.BASE_URL}/${role.id}`, role)
        .pipe(
          catchError((err) => {
            this.messageService.publishError('Errore modifica item');
            return throwError(() => err);
          })
        );
    } else {
      role = {
        id: current.id=0,
        nome: current.nome,
        descrizione: current.descrizione,
      };
      console.log('inserisco evento di salvataggio');

      return this.httpClient.post<Role>(`${this.BASE_URL}`, role).pipe(
        catchError((err) => {
          this.messageService.publishError('Errore creazione item');
          return throwError(() => err);
        })
      );
    }
  }

  delete(role: Role): Observable<Role> | void {
    let index = this.arrayRole.findIndex((e) => e.id == role.id);
    if (index > -1) {
      if (confirm(`Sei sicuro di voler eliminare l'elemento?`)) {
        return this.httpClient.delete<Role>(`${this.BASE_URL}/${role.id}`).pipe(
          tap(() => {
            // Rimuove l'elemento dall'array locale
            this.arrayRole.splice(index, 1);
            // Aggiorna la lista utenti richiamando findAll()
            this.findAll().subscribe();
          }),
          catchError((err) => {
            this.messageService.publishError('Errore cancellazione item');
            return throwError(() => err);
          })
        );
      }
    } else {
      alert('Nessun elemento trovato nella lista');
    }
  }
}
