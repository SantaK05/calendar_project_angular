import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SquareBtnComponent } from './resumable/square-btn/square-btn.component';
import { CalendarioService } from './pages/landing-calendario/calendario.service';
import { Observable } from 'rxjs';
import { Calendario, ListaCelle } from './pages/landing-calendario/interfaces/calendario';
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
    isHighlightWeek(settimana: Map<number, boolean[]>): boolean {
        for (const giorno of settimana.values()) {
            if (giorno[0]) { // giorno[0] rappresenta `isToday`
                return true;
            }
        }
        return false;
    }

    //passare un indice come parametro di mese e anno modificabili cliccando sui bottoni delle freccette
    getCalendarioCompleto() {
        this.service.getCalendarioCompleto(this.service.dataObj.getFullYear(), this.service.dataObj.getMonth() + 1);

        this.listGiorni = this.service.listGiorni;
    }

    listGiorni: Array<Map<number, boolean[]>> = [];
}
