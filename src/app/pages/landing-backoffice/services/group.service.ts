import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, Observable, throwError } from 'rxjs';
import { MessageService } from './message.service';
import { Group } from '../../landing-calendario/interfaces/backoffice';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  arrayGroup: Group[] = [];

  BASE_URL = 'http://localhost:8082/groups';

  constructor(private httpClient: HttpClient, private messageService: MessageService) {

    this.findAll().subscribe();
  }

  findAll(): Observable<Group[]> {

    return this.httpClient.get<Group[]>(`${this.BASE_URL}`).pipe(
      tap(data => {

        console.log(`aggiorno l'elenco dei gruppo nel service`);
        this.arrayGroup = data as Group[];
      }),
      catchError(err => {
        this.messageService.publishError('Errore find group');
        return throwError(() => err);
      })
    );
  }

  load(id: string): Observable<Group> {

    return this.httpClient.get<Group>(`${this.BASE_URL}/${id}`).pipe(
      catchError(err => {
        this.messageService.publishError('Errore find single group');
        return throwError(() => err);
      })
    );
  }

  save(current: Group): Observable<Group> {

    console.log('richiamato metodo save');

    let group = this.arrayGroup.find(e => e.id == current.id);
    if (group) {

      console.log('inserisco evento di modifica');

      group.nome = current.nome;
      group.ruoli = current.ruoli;
      group.utenti = current.utenti;

      return this.httpClient.put<Group>(`${this.BASE_URL}/${group.id}`, group).pipe(
        catchError(err => {
          this.messageService.publishError('Errore modifica gruppo');
          return throwError(() => err);
        })
      );

    } else {

      group = {
        id: current.id = 0,
        nome: current.nome,
        utenti: current.utenti,
        ruoli: current.ruoli
        
        }
      console.log('inserisco evento di salvataggio');

      return this.httpClient.post<Group>(`${this.BASE_URL}`, group).pipe(
        catchError(err => {
          this.messageService.publishError('Errore creazione gruppo');
          return throwError(() => err);
        })
      );
      
    }
    
  } 
  

  delete(group: Group): Observable<Group> | void {

    let index = this.arrayGroup.findIndex(e => e.id == group.id);
    if (index > -1) {

      if (confirm(`Sei sicuro di voler eliminare l'elemento?`)) {

        return this.httpClient.delete<Group>(`${this.BASE_URL}/${group.id}`).pipe(
          catchError(err => {
            this.messageService.publishError('Errore cancellazione gruppo');
            return throwError(() => err);
          })
        )

      }
    } else {
      alert('Nessun elemento trovato nella lista');
    }
  }
}
