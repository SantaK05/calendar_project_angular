import { Component } from '@angular/core';
import { Calendario } from './interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";
import { CalendarioService } from './calendario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageCalendarioComponent } from './message-calendario/message-calendario.component';
import { CellComponent } from './cell/cell.component';
@Component({
  selector: 'app-landing-calendario',
  imports: [CommonModule, SquareBtnComponent, CellComponent, MessageCalendarioComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent {
    calendario!: Calendario | null;
    monthLong: string = '';
    year: number = 0;
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];  
    
    constructor(private readonly service: CalendarioService, private readonly router: Router) { 
        this.service.calendario$.subscribe((updatedCalendario) => {
            this.calendario = updatedCalendario;
            this.monthLong = updatedCalendario?.data ? new Intl.DateTimeFormat("en-US", { month: 'long' }).format(new Date(updatedCalendario.data)) : '';
            this.year = this.service.yearNum;

            if (updatedCalendario?.data) {
                console.info(`Calendario aggiornato: ${updatedCalendario.data}`);
            }
        });

        // Sottoscrizione alla lista di giorni
        this.service.listGiorni$.subscribe((updatedListGiorni) => {
            this.listGiorni = updatedListGiorni;
        });
    }

    selectToday(): void { 
        this.service.selectToday();
    }

    visualCella(day: number, month: number, year: number): void {
        let targetMonth = month + 1;
        let targetYear = year;

        this.router.navigateByUrl(`/calendario/d/${targetYear}/${targetMonth}/${day}`);
    }
}
