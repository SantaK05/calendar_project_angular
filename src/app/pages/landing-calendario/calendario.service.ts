import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendario } from './interfaces/calendario';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MessageCalendarioService } from './message-calendario/message-calendario.service';

@Injectable({
  providedIn: 'root'
})

export class CalendarioService {
    BASE_URL: string = "http://localhost:8081/";

    constructor(private http: HttpClient, private messageService: MessageCalendarioService) { }

    getCalendarioJSON(year: number, month: number): Observable<Calendario> {
        return this.http.get<Calendario>(`${this.BASE_URL}/home/m/${year}/${month}`).pipe(
            tap(data => {
                console.info(`Ottenimento calendario ${month} ${year}`);
            }),
            catchError(err => {
                this.messageService.publishError('Errore nel caricamento del calendario');
                return throwError(() => err);
            })
        );
    }
}
