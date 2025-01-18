import { Component, Input } from '@angular/core';
import { Calendario } from '../interfaces/calendario';
import { CalendarioService } from '../calendario.service';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from "../../../resumable/resources/resources.component";

@Component({
  selector: 'calendar-cell',
  imports: [CommonModule, ResourcesComponent],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})

export class CellComponent {
    getUrl = /\/calendario\/d\/(\d{4})\/(\d{1,2})\/(\d{1,2})/;

    hours: number[] = Array.from({ length: 24 }, (_, index) => index);

    cellIndex: number = 0; 

    calendario!: Calendario | null;
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];  

    day: number = 0;
    dayLong: string = '';
    match: RegExpMatchArray | null = null;

    listSlotPrenotazioni: Array<any> = [];

    constructor(private readonly service: CalendarioService) {
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
        this.listGiorni = this.service.listGiorni;
        this.service.calendario$.subscribe((updatedCalendario) => {
            if (updatedCalendario?.provenienza === 'visualCella') {
                this.calendario = updatedCalendario;
                
                this.service.listGiorni$.subscribe((updatedListGiorni) => {
                    this.listGiorni = updatedListGiorni;
                });
            }
        });

        this.cellIndex = this.getCellIndex();
        this.getSlotPrenotazione(this.cellIndex);
    }

    getCellIndex(): number {
        if (this.listGiorni) {
            for (const settimana of this.listGiorni) {
                for (const giorno of settimana.values()) {
                    if (giorno[0][0]) {
                        return giorno[1][2];
                    }
                }
            }
        }

        return 0;
    }

    getSlotPrenotazione(index: number): void {
        if (this.calendario) {
            for (let i = 0; i < this.calendario.listaCelle.length; i++) {
                if (i === index) {
                    this.listSlotPrenotazioni = this.calendario.listaCelle[i].slotPrenotazioneList
                }
            }
        }
    }
}
