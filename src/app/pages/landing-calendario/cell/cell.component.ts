import { AfterContentChecked, AfterContentInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioService } from '../calendario.service';
import { Calendario, PrenotazioneList, SlotPrenotazioneList } from '../interfaces/calendario';
@Component({
  selector: 'calendar-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})

export class CellComponent implements AfterContentInit {
    giorno!: Calendario | null;

    day: number = 0;
    dayLong: string = '';
    match: RegExpMatchArray | null = null;
    GETURL = /\/calendario\/(\d{4})\/(\d{1,2})\/(\d{1,2})/;

    listSlotPrenotazioni: SlotPrenotazioneList[] = [];
    listPrenotazioni: PrenotazioneList[] = [];

    constructor(private readonly serviceCalendario: CalendarioService) { 
        this.serviceCalendario.path$.subscribe((url: string) => {
            this.match = url.match(this.GETURL);
            
            if (this.match) {
                this.day = Number(this.match[3]);
                this.serviceCalendario.monthNum = Number(this.match[2]);
                this.serviceCalendario.yearNum = Number(this.match[1]);
                this.serviceCalendario.getCalendarioGiornaliero(Number(this.match[1]), Number(this.match[2]), Number(this.match[3]))

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
        
        // Inizializza la lista delle prenotazioni con 3 elementi fittizi
        this.listPrenotazioni = [
            {
                id: 1,
                data: '2025-02-06',
                idSlotPrenotazione: this.listSlotPrenotazioni[0]?.id || 1,
                idUtente: 101,
                oraInizio: '09:00',
                oraFine: '10:00'
            },
            {
                id: 2,
                data: '2025-02-06',
                idSlotPrenotazione: this.listSlotPrenotazioni[1]?.id || 2,
                idUtente: 102,
                oraInizio: '10:00',
                oraFine: '11:00'
            },
            {
                id: 3,
                data: '2025-02-06',
                idSlotPrenotazione: this.listSlotPrenotazioni[2]?.id || 3,
                idUtente: 103,
                oraInizio: '11:00',
                oraFine: '12:00'
            }
        ];
    }

    ngAfterContentInit(): void {
        this.serviceCalendario.calendario$.subscribe(updatedeCaledarioGiornaliero => {
            if (updatedeCaledarioGiornaliero?.provenienza == 'visualCella') {
                this.giorno = updatedeCaledarioGiornaliero;
        
                // Recupera la lista degli slot già presenti
                this.listSlotPrenotazioni = this.giorno.listaCelle[0].slotPrenotazioneList || [];
                
                // Definisce l'orario di inizio e fine della giornata
                const orarioInizio = new Date('2025-02-06T09:00:00');
                const orarioFine = new Date('2025-02-06T18:00:00');
                
                // Ordina gli slot esistenti per data di inizio
                this.listSlotPrenotazioni.sort((a, b) => new Date(a.dataInizio).getTime() - new Date(b.dataInizio).getTime());
                
                let orarioCorrente = orarioInizio;
                const nuoviSlot = [];
                
                // Scansiona gli slot esistenti e riempie i gap
                for (const slot of this.listSlotPrenotazioni) {
                    let inizioSlot = new Date(slot.dataInizio);
                    if (orarioCorrente < inizioSlot) {
                        while (orarioCorrente < inizioSlot && orarioCorrente < orarioFine) {
                            let fineSlot = new Date(orarioCorrente.getTime() + 60 * 60 * 1000);
                            if (fineSlot > inizioSlot) break;
                            
                            nuoviSlot.push({
                                id: this.listSlotPrenotazioni.length + nuoviSlot.length + 1,
                                resource: {
                                    id: 0,
                                    title: '',
                                    descrizione: '',
                                    prenotabile: true,
                                    accessoRemoto: false,
                                    info1: '',
                                    info2: '',
                                    info3: '',
                                    info4: '',
                                    info5: ''
                                },
                                nome: `Slot Fittizio`,
                                dataInizio: orarioCorrente.toISOString(),
                                dataFine: fineSlot.toISOString(),
                                libero: true,
                                note: 'Slot generato automaticamente'
                            });
                            
                            orarioCorrente = fineSlot;
                        }
                    }
                    orarioCorrente = new Date(slot.dataFine);
                }
                
                // Riempie eventuali slot fino alle 18
                while (orarioCorrente < orarioFine && nuoviSlot.length + this.listSlotPrenotazioni.length < 8) {
                    let fineSlot = new Date(orarioCorrente.getTime() + 60 * 60 * 1000);
                    if (fineSlot > orarioFine) break;
                    
                    nuoviSlot.push({
                        id: this.listSlotPrenotazioni.length + nuoviSlot.length + 1,
                        resource: {
                            id: 0,
                            title: '',
                            descrizione: '',
                            prenotabile: true,
                            accessoRemoto: false,
                            info1: '',
                            info2: '',
                            info3: '',
                            info4: '',
                            info5: ''
                        },
                        nome: `Slot Fittizio`,
                        dataInizio: orarioCorrente.toISOString(),
                        dataFine: fineSlot.toISOString(),
                        libero: true,
                        note: 'Slot generato automaticamente'
                    });
                    
                    orarioCorrente = fineSlot;
                }
                
                this.listSlotPrenotazioni = [...this.listSlotPrenotazioni, ...nuoviSlot];
            }
            console.log(this.listSlotPrenotazioni)
        });
    }
}
