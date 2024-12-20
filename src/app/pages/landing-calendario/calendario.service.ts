import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendario, ListaCelle } from './interfaces/calendario';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MessageCalendarioService } from './message-calendario/message-calendario.service';

@Injectable({
    providedIn: 'root'
})

export class CalendarioService {
    BASE_URL: string = "http://localhost:8081/";

    dataObj = new Date();
    monthNum!: number;
    yearNum!: number;

    obsCalendar!: Observable<Calendario>;
    result!: Calendario;
    year: number = 0;
    monthLong: string = '';

    gruppo: Map<number, boolean[]> = new Map<number, boolean[]>();
    listGiorni: Array<Map<number, boolean[]>> = [];

    constructor(private http: HttpClient, private messageService: MessageCalendarioService) {
        this.monthNum = this.dataObj.getUTCMonth() + 1;
        this.yearNum = this.dataObj.getUTCFullYear();
    }

    getCalendarioCompleto(year: number, month: number) {
        // Chimata per ricevere il calendario
        this.obsCalendar = this.getCalendarioJSON(year, month);
        this.obsCalendar.subscribe((data) => {
            this.result = data;
            console.info(`Data del calendario selezionato: ${this.result.data}`);
        });

        this.dataObj = new Date(this.result.data);
        this.year = this.dataObj.getFullYear();
        this.monthLong = new Intl.DateTimeFormat("en-US", { month: 'long' }).format(this.dataObj);

        this.caricaCalendarioMin(this.result.listaCelle);
    }

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

    caricaCalendarioMin(listaCelle: ListaCelle[]) {
        listaCelle.forEach((element) => {
            this.dataObj = new Date(element.data);
            let giorno: number = this.dataObj.getUTCDate();
            let mese: number = this.dataObj.getUTCMonth();
            let anno: number = this.dataObj.getUTCFullYear();

            const isToday = this.isOggi(giorno, mese, anno);
            const traspDay = this.isGiornoDelMese(mese);
            this.gruppo.set(giorno, [isToday, traspDay]);

            if (this.gruppo.size === 7) {
                this.listGiorni.push(new Map(this.gruppo));
                this.gruppo.clear();
            }
        });
    }

    // ?Caricamento calendario
    isOggi(giorno: number, mese: number, anno: number): boolean {
        const oggi = new Date(); // Data corrente
        return (
            oggi.getFullYear() === anno &&
            oggi.getMonth() === mese &&
            oggi.getDate() === giorno
        );
    }

    isGiornoDelMese(mese: number): boolean {
        const meseAttuale = new Date().getUTCMonth();
        return meseAttuale !== mese;
    }

    incMese() {
        if(this.monthNum == 12) {
            this.monthNum = 1;
            this.yearNum++;
        } else {
            this.monthNum++;
        }

        // NEXT SUBJECT
    }

    decMese() {
        if(this.monthNum == 1) {
            this.monthNum = 12;
            this.yearNum--;
        } else {
            this.monthNum--;
        }

        // NEXT SUBJECT
    }
}
