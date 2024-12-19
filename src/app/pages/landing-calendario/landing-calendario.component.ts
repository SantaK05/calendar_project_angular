import { Component, OnInit } from '@angular/core';
import { Calendario, ListaCelle } from './interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";
import { CalendarioService } from './calendario.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageCalendarioComponent } from './message-calendario/message-calendario.component';
@Component({
  selector: 'app-landing-calendario',
  imports: [CommonModule, SquareBtnComponent, MessageCalendarioComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent implements OnInit {
    calendario!: Calendario;
    dataObj = new Date();
    monthNum!: number;
    yearNum!: number;

    constructor(private readonly service: CalendarioService, private router: Router) {
        this.monthNum = this.dataObj.getUTCMonth() + 1;
        this.yearNum = this.dataObj.getUTCFullYear();
    }
    
    ngOnInit(): void {
        console.log('caricamento DOM');
        this.getCalendarioCompleto(this.yearNum, this.monthNum);
    }

    obsCalendar!: Observable<Calendario>; 
    result!: Calendario;
    year: number = 0;
    monthLong: string = '';

    getCalendarioCompleto(year: number, month: number) {
        // Chimata per ricevere il calendario
        this.obsCalendar = this.service.getCalendarioJSON(year, month);
        this.obsCalendar.subscribe((data) => {
            this.result = data;
            console.info(`Data del calendario selezionato: ${this.result.data}`);
        });

        this.dataObj = new Date(this.result.data);
        this.year = this.dataObj.getFullYear();
        this.monthLong = new Intl.DateTimeFormat("en-US", { month: 'long' }).format(this.dataObj);
    
        this.caricaCalendarioMin(this.result.listaCelle);
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

    gruppo: Map<number, boolean[]> = new Map<number, boolean[]>();
    listGiorni: Array<Map<number, boolean[]>> = [];
    
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

    visualCella(giorno: number): void {
        console.log('visual cella');
        this.router.navigateByUrl(`/d/${this.dataObj.getUTCFullYear()}/${this.dataObj.getUTCMonth()}/${giorno}`);
    }
}
