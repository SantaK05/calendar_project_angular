import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrenotazioneList, SlotPrenotazioneList } from '../../pages/landing-calendario/interfaces/calendario';
import { ReservationService } from './reservation.service';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, tap } from 'rxjs';

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
        title: '',
        dateStart: '',
        dateEnd: '',
        free: true,
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

    constructor(private readonly service: ReservationService) { }
    
    ngOnInit(): void {
        this.listSlotPrenotazioni = this.service.listSlotPrenotazioni;
        this.subscription = this.service.slotSingolo$.subscribe(
            (slot) => {
                console.log(slot);
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
        this.currentPrenotazione = {
            id: 0, 
            data: this.currentSlot.dateStart.substring(0, 19),   
            idSlotPrenotazione: this.currentSlot.id,                  
            idUtente: 0,
            oraInizio: this.currentSlot.dateStart.substring(0, 19),
            oraFine: this.currentSlot.dateEnd.substring(0, 19)
        };

        console.log(this.currentPrenotazione.data);
        const [yearStr, monthStr, dayStr] = this.currentPrenotazione.data.split("T")[0].split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        this.service.save(this.currentPrenotazione).pipe(
            switchMap((response) => {
                return this.service.findAllPrenotazioni(year, month, day);
            }),
            tap((data:any) => {
                console.log('salvataggio');
            })
        ).subscribe()
    }

    onSlotChange() {
        const slot = this.listSlotPrenotazioni.find(e => e.title === this.currentSlot.title);

        if (slot) {
            // Aggiorna l'oggetto `current` con lo slot trovato
            this.currentSlot = { ...slot };
            this.currentPrenotazione.data = this.currentSlot.dateStart.split('T')[0];
            this.currentPrenotazione.idSlotPrenotazione = this.currentSlot.id;
            this.currentPrenotazione.oraInizio = this.currentSlot.dateStart;
            this.currentPrenotazione.oraFine = this.currentSlot.dateEnd;
        } else {
            console.warn('Slot non trovato per il nome selezionato:', this.currentSlot.title);
        }
    }
}
