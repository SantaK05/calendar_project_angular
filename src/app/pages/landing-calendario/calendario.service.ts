import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendario, ListaCelle } from './interfaces/calendario';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { MessageCalendarioService } from './message-calendario/message-calendario.service';

@Injectable({
    providedIn: 'root'
})

export class CalendarioService {
    BASE_URL: string = "http://localhost:8081/";

    dataObj = new Date();
    monthNum!: number;
    yearNum!: number;

    private readonly calendarioSubject = new BehaviorSubject<Calendario | null>(null);
    calendario$ = this.calendarioSubject.asObservable();
    obsCalendar!: Observable<Calendario>;
    result!: Calendario;

    private readonly listGiorniSubject = new BehaviorSubject<Array<Map<number, [boolean[], number[]]>>>([]);
    listGiorni$ = this.listGiorniSubject.asObservable();
    gruppo: Map<number, [boolean[], number[]]> = new Map<number, [boolean[], number[]]>();
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];
    
    constructor(private readonly http: HttpClient, private readonly messageService: MessageCalendarioService) {
        this.monthNum = this.dataObj.getUTCMonth() + 1;
        this.yearNum = this.dataObj.getUTCFullYear();
    
        this.getCalendarioCompleto(this.yearNum, this.monthNum);
    }

    getCalendarioCompleto(year: number, month: number) {
        // Chimata per ricevere il calendario
        this.obsCalendar = this.getCalendarioJSON(year, month);
        this.obsCalendar.subscribe((data) => {
            this.result = data;
            this.calendarioSubject.next(this.result); // Notifica i cambiamenti

            this.dataObj = new Date(this.result.data);
            this.yearNum = this.dataObj.getFullYear();

            this.caricaCalendarioMin(this.result.listaCelle);
        });
    }

    getCalendarioJSON(year: number, month: number): Observable<Calendario> {
        return this.http.get<Calendario>(`${this.BASE_URL}/home/m/${year}/${month}`).pipe(
            catchError(err => {
                this.messageService.publishError('Errore nel caricamento del calendario');
                return throwError(() => err);
            })
        );
    }

    caricaCalendarioMin(listaCelle: ListaCelle[]) {
        this.listGiorni = [];
        this.gruppo.clear();

        listaCelle.forEach((element) => {
            this.dataObj = new Date(element.data);
            let giorno: number = this.dataObj.getUTCDate();
            let mese: number = this.dataObj.getUTCMonth();
            let anno: number = this.dataObj.getUTCFullYear();

            const isToday = this.isOggi(giorno, mese, anno);
            const traspDay = this.isGiornoDelMese(mese, anno);
            this.gruppo.set(giorno, [[isToday, traspDay], [mese, anno]]);

            if (this.gruppo.size === 7) {
                this.listGiorni.push(new Map(this.gruppo));
                this.gruppo.clear();
            }
        });

        this.listGiorniSubject.next(this.listGiorni);
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

    isGiornoDelMese(mese: number, anno: number): boolean {
        const oggi = new Date(); // Data corrente
        return !(
            oggi.getFullYear() === anno &&
            oggi.getMonth() === mese
        );
    }

    // ?Spostamento mese
    incMese() {
        if(this.monthNum == 12) {
            this.monthNum = 1;
            this.yearNum++;
        } else {
            this.monthNum++;
        }

        this.getCalendarioCompleto(this.yearNum, this.monthNum);
        console.info(`Mese: ${this.monthNum}, Anno: ${this.yearNum}`);
    }

    decMese() {
        if(this.monthNum == 1) {
            this.monthNum = 12;
            this.yearNum--;
        } else {
            this.monthNum--;
        }

        this.getCalendarioCompleto(this.yearNum, this.monthNum);
        console.info(`Mese: ${this.monthNum}, Anno: ${this.yearNum}`);
    }

    selectToday() { 
        this.dataObj = new Date();
        this.monthNum = this.dataObj.getUTCMonth() + 1;
        this.yearNum = this.dataObj.getUTCFullYear();
        this.getCalendarioCompleto(this.yearNum, this.monthNum);
    }
}
