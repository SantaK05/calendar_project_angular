import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SquareBtnComponent } from './resumable/square-btn/square-btn.component';
import { CalendarioService } from './pages/landing-calendario/calendario.service';
import { groupBy, Observable } from 'rxjs';
import { Calendario, ListaCelle } from './interfaces/calendario';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SquareBtnComponent],  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
    title = 'calendario';

    constructor(private readonly service: CalendarioService) { }

    ngOnInit(): void {
        this.getCalendarioCompleto();
    }

    // ?Gestione animazioni sidebar
    activeButtonId: string | null = null;
    
    handleButtonClick(event: Event, buttonId: string) {
        if (this.activeButtonId === buttonId) {
            this.activeButtonId = null;
        } else {
            this.activeButtonId = buttonId;
        }
        event.stopPropagation();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.activeButtonId !== "sb-shower") {
            this.activeButtonId = null;
        }
    }

    isButtonActive(buttonId: string): boolean {
        return this.activeButtonId === buttonId;
    }

    // ?Caricamento calendario esterno
    isOggi(giorno: number, mese: number, anno: number): boolean {
        const oggi = new Date(); // Data corrente
        return (
            oggi.getFullYear() === anno &&
            oggi.getMonth() === mese &&
            oggi.getDate() === giorno
        );
    }

    isGiornoDelMese(mese: number): boolean {
        const meseAttuale = new Date().getUTCMonth();
        return meseAttuale !== mese;
    }

    dataObj = new Date();
    obsCalendar!: Observable<Calendario>; 
    result!: Calendario;
    getCalendarioCompleto() {
        console.log('Caricamento calendario side bar');

        // Chimata per ricevere il calendario
        this.obsCalendar = this.service.getCalendarioJSON(this.dataObj.getFullYear(), this.dataObj.getMonth() + 1);
        this.obsCalendar.subscribe((data) => {
            this.result = data;
        });

        this.caricaCalendarioMin(this.result.listaCelle);
    }

    gruppo: Map<number, boolean[]> = new Map<number, boolean[]>();
    listGiorni: Array<Map<number, boolean[]>> = [];
    
    caricaCalendarioMin(listaCelle: ListaCelle[]) {
        listaCelle.forEach((element) => {
            this.dataObj = new Date(element.data);
            let giorno: number = this.dataObj.getUTCDate();
            let mese: number = this.dataObj.getUTCMonth();
            let anno: number = this.dataObj.getUTCFullYear();
            
            const isToday = this.isOggi(giorno, mese, anno);
            const traspDay = this.isGiornoDelMese(mese);
            this.gruppo.set(giorno, [isToday, traspDay]);
            
            if (this.gruppo.size === 7) {
                this.listGiorni.push(new Map(this.gruppo));
                this.gruppo.clear();
            }
        });
    }
}
