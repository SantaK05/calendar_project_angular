import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageCalendarioService } from '../../pages/landing-calendario/message-calendario/message-calendario.service';
import { SlotPrenotazioneList } from '../../pages/landing-calendario/interfaces/calendario';
import { BehaviorSubject, catchError, Observable, skip, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {
    listSlotPrenotazioni: Array<SlotPrenotazioneList> = [];
    private slotSingoloSubject = new BehaviorSubject<SlotPrenotazioneList>({
        id: 0,
        risorsa: {
            id: 0,
            nome: '',
            descrizione: '',
            prenotabile: false,
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
        libero: false,
        note: ''
    });
    public slotSingolo$ = this.slotSingoloSubject.asObservable();

    BASE_URL = 'http://localhost:8081/prenotazione';

    constructor(private http: HttpClient, private messageService: MessageCalendarioService) { }

    findAllSlots(listSP: Array<SlotPrenotazioneList>): void {
        this.listSlotPrenotazioni = listSP;
    }

    load(id: number): void {
        let slot = this.listSlotPrenotazioni.find(e => e.id === id);
        if (slot) {
            this.slotSingoloSubject.next(slot);
        }
    }

    save(current: SlotPrenotazioneList): Observable<SlotPrenotazioneList> {
        console.info('richiamato metodo save');

        let slot = this.listSlotPrenotazioni.find(e => e.id == current.id);
        if (slot) {
            slot.risorsa = current.risorsa;
            slot.nome = current.nome;
            slot.dataInizio = current.dataInizio;
            slot.dataFine = current.dataFine;
            slot.libero = current.libero;
            slot.note = current.note;
        } else {
            return throwError(() => new Error('Slot not found'));
        }

        return this.http.post<SlotPrenotazioneList>(`${this.BASE_URL}`, slot).pipe(
            catchError(err => {
                this.messageService.publishError('Errore salvataggio prenotazione');
                return throwError(() => err);
            }),
            tap(() => {
                this.messageService.publishInfo('Prenotazione effettuata')
            })
        );
    }

    delete(slot: SlotPrenotazioneList): Observable<SlotPrenotazioneList> | void {
        let index = this.listSlotPrenotazioni.findIndex(e => e.id == slot.id);
        if (index > -1) {

            if (confirm(`Sei sicuro di voler eliminare la prenotazione?`)) {
                
                return this.http.delete<SlotPrenotazioneList>(`${this.BASE_URL}/${slot.id}`).pipe(
                    catchError(err => {
                        this.messageService.publishError('Errore cancellazione prenotazione');
                        return throwError(() => err);
                    })
                )

            }
        } else {
            alert('Nessuna prenotazione trovata nella lista');
        } 
    }
}
