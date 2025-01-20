import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlotPrenotazioneList } from '../../pages/landing-calendario/interfaces/calendario';
import { ReservationService } from './reservation.service';
import { CommonModule } from '@angular/common';
import { Subscription, tap } from 'rxjs';
import { CellComponent } from '../../pages/landing-calendario/cell/cell.component';
import { LandingCalendarioComponent } from '../../pages/landing-calendario/landing-calendario.component';

@Component({
  selector: 'resources',
  imports: [FormsModule, CommonModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})

export class ResourcesComponent implements OnInit, OnDestroy {
    listSlotPrenotazioni: Array<SlotPrenotazioneList> = [];
    current: SlotPrenotazioneList = {
        id: 0,
        risorsa: {
            id: 0,
            nome: '',
            descrizione: '',
            prenotabile: true,
            accessoRemoto: true,
            info1: '',
            info2: '',
            info3: '',
            info4: '',
            info5: ''
        },
        nome: '',
        dataInizio: '',
        dataFine: '',
        libero: true,
        note: ''
    }
    private subscription!: Subscription;


    constructor(private readonly service: ReservationService, private readonly cell: CellComponent, private readonly cal: LandingCalendarioComponent) { }
    
    ngOnInit(): void {
        this.listSlotPrenotazioni = this.service.listSlotPrenotazioni;
        this.subscription = this.service.slotSingolo$.subscribe(
            (slot) => {
                this.current = slot;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    save() {
        this.service.save(this.current).pipe(
            tap((data:any) => {
                console.log('salvataggio')
            })
        ).subscribe()

        this.cell.showTabRes = false;
        this.cal.showTabRes = false;
    }

    onSlotChange() {
        const slot = this.listSlotPrenotazioni.find(e => e.nome === this.current.nome);

        if (slot) {
            // Aggiorna l'oggetto `current` con lo slot trovato
            this.current = { ...slot };
        } else {
            console.warn('Slot non trovato per il nome selezionato:', this.current.nome);
        }
    }
}
