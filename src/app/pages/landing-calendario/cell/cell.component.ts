import { Component, OnChanges, OnInit } from '@angular/core';
import { Calendario } from '../interfaces/calendario';
import { CalendarioService } from '../calendario.service';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from "../../../resumable/resources/resources.component";
import { ReservationService } from '../../../resumable/resources/reservation.service';
import { LandingCalendarioComponent } from '../landing-calendario.component';

@Component({
  selector: 'calendar-cell',
  imports: [CommonModule, ResourcesComponent],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})

export class CellComponent implements OnInit {
    getUrl = /\/calendario\/(\d{4})\/(\d{1,2})\/(\d{1,2})/;

    hours: number[] = Array.from({ length: 24 }, (_, index) => index);
    
    cellIndex: number = 0; 
    isLoaded: boolean = false;
    showTabRes!: boolean;

    calendario!: Calendario | null;
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];  

    day: number = 0;
    dayLong: string = '';
    match: RegExpMatchArray | null = null;

    listSlotPrenotazioni: Array<any> = [];

    constructor(private readonly service: CalendarioService, private readonly serviceReservation: ReservationService, private readonly cal: LandingCalendarioComponent) {
        this.isLoaded = false;
        
        this.service.path$.subscribe((url: string) => {
            this.match = url.match(this.getUrl);
            
            if (this.match) {
                this.day = Number(this.match[3]);
                
                this.service.monthNum = Number(this.match[2]);
                this.service.yearNum = Number(this.match[1]);
                this.service.getCalendarioCompleto(Number(this.match[1]), Number(this.match[2]), 'visualCella')

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
        
        this.service.showTabRes.subscribe((switchTab) => {
            this.showTabRes = switchTab;
        });
    }
    
    ngOnInit() {
        const prenotazioni = this.calendario?.listaCelle?.[this.cellIndex]?.prenotazioneList || [];
        prenotazioni.forEach((prenotazione) => {
            if (prenotazione.id) {
                this.getPrenotazione(prenotazione.id);
            }
        });
        
        this.service.calendario$.subscribe((updatedCalendario) => {
            this.isLoaded = false;
            if (updatedCalendario?.provenienza === 'visualCella') {
                this.calendario = updatedCalendario;
                console.log(this.calendario);
                this.service.listGiorni$.subscribe((updatedListGiorni) => {
                    this.listGiorni = updatedListGiorni;
                });
                if (this.listSlotPrenotazioni) {
                    this.isLoaded = true;
                }
                
                this.cellIndex = this.getCellIndex();
                this.getSlotPrenotazioni(this.cellIndex);
            }
        });
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

    getSlotPrenotazioni(index: number): void {
        if (this.calendario) {
            for (let i = 0; i < this.calendario.listaCelle.length; i++) {
                if (i === index) {
                    this.listSlotPrenotazioni = this.calendario.listaCelle[i].slotPrenotazioneList
                }
            }
        }

        if (this.listSlotPrenotazioni) {
            this.serviceReservation.findAllSlots(this.listSlotPrenotazioni);
        }
    }

    getSlotPrenotazioneSing(index: number): void {
        this.cal.showTabRes = true;
        this.showTabRes = true;
        this.serviceReservation.load(index);
    }

    getPrenotazione(index: number) {
        this.serviceReservation.findPrenotazione(index).subscribe({
            next: (prenotazione) => {
                this.listSlotPrenotazioni.push(prenotazione);
            },
            error: (err) => {
                console.error('Errore durante il recupero della prenotazione:', err);
            }
        });
    }
}
