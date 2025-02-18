import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageCalendarioService } from '../../pages/landing-calendario/message-calendario/message-calendario.service';
import { PrenotazioneList, SlotPrenotazioneList } from '../../pages/landing-calendario/interfaces/calendario';
import { BehaviorSubject, catchError, Observable, skip, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {
    listPrenotazioni: Array<PrenotazioneList> = [];
    private readonly prenotazioniSubject = new BehaviorSubject<PrenotazioneList[] | null>(null);
    prenotazioni$ = this.prenotazioniSubject.asObservable();

    listSlotPrenotazioni: Array<SlotPrenotazioneList> = [];
    private slotSingoloSubject = new BehaviorSubject<SlotPrenotazioneList>({
        id: 0,
        resource: {
            id: 0,
            title: '',
            descrizione: '',
            prenotabile: false,
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
        free: false,
        note: ''
    });
    public slotSingolo$ = this.slotSingoloSubject.asObservable();

    BASE_URL = 'http://localhost:8080/calendario/prenotazione';

    constructor(private http: HttpClient, private messageService: MessageCalendarioService) { }

    findAllPrenotazioni(anno: number, mese: number, giorno: number): Observable<PrenotazioneList[]> {
        return this.http.get<PrenotazioneList[]>(`${this.BASE_URL}/data/${anno}/${mese}/${giorno}`).pipe(
            tap(data => {
                this.prenotazioniSubject.next(data);
            }),
            catchError(err => {
                this.messageService.publishError('Errore find all reservation');
                return throwError(() => err);
            })
        )
    }

    findAllSlots(listSP: Array<SlotPrenotazioneList>): void {
        this.listSlotPrenotazioni = listSP;
    }

    findPrenotazione(id: number) {
        return this.http.get<PrenotazioneList>(`${this.BASE_URL}/${id}`).pipe(
            catchError(err => {
                this.messageService.publishError('Errore find single reservation');
                return throwError(() => err);
            })
        );
    }

    load(id: number): void {
        let slot = this.listSlotPrenotazioni.find(e => e.id === id);
        if (slot) {
            this.slotSingoloSubject.next(slot);
        }
    }

    save(current: PrenotazioneList): Observable<PrenotazioneList> {
        console.info('richiamato metodo save');

        let prenotazione = this.listPrenotazioni.find(e => e.id == current.id);
        if (prenotazione) {

            // devo modificare solo gli attributi dell'oggetto trovato
            prenotazione.data = current.data;
            prenotazione.idSlotPrenotazione = current.idSlotPrenotazione;
            prenotazione.idUtente = current.idUtente;
            prenotazione.oraInizio = current.oraInizio;
            prenotazione.oraFine = current.oraFine;

            return this.http.put<PrenotazioneList>(`${this.BASE_URL}/${prenotazione.id}`, prenotazione).pipe(
                catchError(err => {
                    this.messageService.publishError('Errore modifica prenotazione');
                    return throwError(() => err);
                })
            );
        
        } else {

            // devo creare il nuovo oggetto da inserire nella lista
            prenotazione = {
                id: 0,
                data: current.data,
                idSlotPrenotazione: current.idSlotPrenotazione,
                idUtente: 0,
                oraInizio: current.oraInizio,
                oraFine: current.oraFine
            }
            console.log('inserisco evento di salvataggio');


            
            return this.http.post<PrenotazioneList>(`${this.BASE_URL}`, prenotazione).pipe(
                catchError(err => {
                    this.messageService.publishError('Errore creazione prenotazione');
                    return throwError(() => err);
                })
            );

        }
    }

    delete(prenotazione: PrenotazioneList): Observable<PrenotazioneList> | void {
        let index = this.listPrenotazioni.findIndex(e => e.id == prenotazione.id);
        if (index > -1) {

            if (confirm(`Sei sicuro di voler eliminare la prenotazione?`)) {
                
                return this.http.delete<PrenotazioneList>(`${this.BASE_URL}/${prenotazione.id}`).pipe(
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
