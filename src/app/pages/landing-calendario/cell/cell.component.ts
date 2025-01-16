import { Component } from '@angular/core';
import { Calendario } from '../interfaces/calendario';
import { Router } from '@angular/router';
import { CalendarioService } from '../calendario.service';
import { CommonModule } from '@angular/common';
import { LandingCalendarioComponent } from '../landing-calendario.component';

@Component({
  selector: 'calendar-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})

export class CellComponent {
    getUrl = /\/calendario\/d\/(\d{4})\/(\d{1,2})\/(\d{1,2})/;

    hours: number[] = Array.from({ length: 24 }, (_, index) => index);

    calendario!: Calendario | null;
    day: number = 0;
    dayLong: string = '';
    match: RegExpMatchArray | null = null;

    constructor(private readonly service: CalendarioService, private landCalendario: LandingCalendarioComponent, private router: Router) {
        this.service.path$.subscribe((url: string) => {
            this.match = url.match(this.getUrl);
    
            if (this.match) {
                this.day = Number(this.match[3]);

                this.service.monthNum = Number(this.match[2]);
                this.service.yearNum = Number(this.match[1]);
                this.service.getCalendarioCompleto(Number(this.match[1]), Number(this.match[2]), '')

                this.dayLong = new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(
                    new Date(
                        Number(this.match[1]), 
                        Number(this.match[2]) - 1, 
                        Number(this.match[3])
                    )
                ).slice(0, 3);
            } else {
                this.dayLong = '';
            }
        });
    
        this.calendario = this.service.result;
        this.service.calendario$.subscribe((updatedCalendario) => {
            if (updatedCalendario?.provenienza === 'visualCella') {
                this.calendario = updatedCalendario;
                console.log(this.calendario);
            }
        });
    }
}
