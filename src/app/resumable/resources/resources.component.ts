import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrenotazioneList, SlotPrenotazioneList } from '../../pages/landing-calendario/interfaces/calendario';
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
    currentSlot: SlotPrenotazioneList = {
        id: 0,
        resource: {
            id: 0,
            title: '',
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

    currentPrenotazione: PrenotazioneList = {
        id: 0, 
        data: '',   
        idSlotPrenotazione: 0,                  
        idUtente: 0,
        oraInizio: '',
        oraFine: ''
    }
    private subscription!: Subscription;


    constructor(private readonly service: ReservationService, private readonly cell: CellComponent, private readonly cal: LandingCalendarioComponent) { }
    
    ngOnInit(): void {
        this.listSlotPrenotazioni = this.service.listSlotPrenotazioni;
        this.subscription = this.service.slotSingolo$.subscribe(
            (slot) => {
                this.currentSlot = slot;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    save() {
        this.service.save(this.currentPrenotazione).pipe(
            tap((data:any) => {
                console.log('salvataggio')
            })
        ).subscribe()

        this.cell.showTabRes = false;
        this.cal.showTabRes = false;
    }

    onSlotChange() {
        const slot = this.listSlotPrenotazioni.find(e => e.nome === this.currentSlot.nome);

        if (slot) {
            // Aggiorna l'oggetto `current` con lo slot trovato
            this.currentSlot = { ...slot };
            this.currentPrenotazione.data = this.currentSlot.dataInizio.split('T')[0];
            this.currentPrenotazione.idSlotPrenotazione = this.currentSlot.id;
            this.currentPrenotazione.oraInizio = this.currentSlot.dataInizio;
            this.currentPrenotazione.oraFine = this.currentSlot.dataFine;
        } else {
            console.warn('Slot non trovato per il nome selezionato:', this.currentSlot.nome);
        }
    }
}
