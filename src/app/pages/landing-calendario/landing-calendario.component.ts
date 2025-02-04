import { AfterContentInit, Component, HostListener } from '@angular/core';
import { Calendario, SlotPrenotazioneList } from './interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";
import { CalendarioService } from './calendario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageCalendarioComponent } from './message-calendario/message-calendario.component';
import { CellComponent } from './cell/cell.component';
@Component({
  selector: 'app-landing-calendario',
  imports: [CommonModule, SquareBtnComponent, CellComponent, MessageCalendarioComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent implements AfterContentInit {
    calendario!: Calendario | null;
    monthLong: string = '';
    year: number = 0;
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];
    
    tipoVis: string | null = '';
    date: string | null = '';

    showTabRes: boolean = false;
    
    ngAfterContentInit() {this.bho();}
    bho() : void {
        var divs = document.getElementsByClassName('prenotazione-cella');
        if (divs) {
            for (let i = 0; i < divs.length; i++) {
                (divs[i] as HTMLElement).style.backgroundColor = this.randomColor();
            }
        }
    }
    hexaColor = ["1", "2", "3", "4", "5", "6", "7"]; 
    randomColor = () => {
        let color = "#";
        for (let i = 0; i < 4; i++) {
        let randomIndex = Math.floor(Math.random() * this.hexaColor.length);
        let randomHexa = this.hexaColor[randomIndex];
        color += randomHexa;
        }
        color+= "FF";  
        return color;
    }
    
    constructor(private readonly service: CalendarioService, private readonly router: Router) { 
        this.service.calendario$.subscribe((updatedCalendario) => {
            if (this.tipoVis != "GIORNALIERO" || updatedCalendario?.provenienza !== 'visualBtn') {
                this.calendario = updatedCalendario;
                this.monthLong = updatedCalendario?.data ? new Intl.DateTimeFormat("en-US", { month: 'long' }).format(new Date(updatedCalendario.data)) : '';
                this.year = updatedCalendario?.data ? new Date(updatedCalendario.data).getFullYear() : 0;

                this.service.listGiorni$.subscribe((updatedListGiorni) => {
                    this.listGiorni = updatedListGiorni;
                });
            }
            
            if (updatedCalendario?.data) {
                console.info(`Calendario aggiornato: ${updatedCalendario.data}`);
            }
        });

        // Recupera la vista selezionata
        this.tipoVis = localStorage.getItem('selectedView');
        this.service.selectedView.subscribe((view) => {
            this.tipoVis = view;
        });

        this.date = localStorage.getItem('today');
        if (this.date && this.tipoVis == 'GIORNALIERO') {
            const [yearStr, monthStr, dayStr] = this.date.split('/');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);

            // Richiama il metodo visualCella
            this.visualCella(day, month, year);
        }
    }

    visualCella(day: number, month: number, year: number): void {
        let targetMonth = month + 1;
        let targetYear = year;

        this.service.changeView("GIORNALIERO"); // Notifica il cambio di vista
        this.router.navigateByUrl(`calendario/${targetYear}/${targetMonth}/${day}`);
    }

    changeTabRes() {
        console.log(this.showTabRes)
        this.showTabRes = !this.showTabRes;
        this.service.changeTabRes(this.showTabRes);
    }

    selectToday(): void { 
        this.service.selectToday();
    }

    // ?Gestione animazioni e salvataggio menu visualizzazione
    visMenu: boolean = false;
    selectedView: string | null = null;
    
    handleViewClick(event: Event, view: string) {
        this.selectedView = view; // Imposta la vista selezionata
        this.visMenu = false; // Nasconde il menu

        this.service.changeView(view); // Modifica il cambio di vista
        if (view === 'MENSILE') {
            this.calendario = this.service.result;
            this.monthLong = this.calendario?.data ? new Intl.DateTimeFormat("en-US", { month: 'long' }).format(new Date(this.calendario.data)) : '';
        }

        if (this.date && view == 'GIORNALIERO') {
            /*TODO aggiungere il controllo del path, com'è adesso quando ritorniamo su giornaliero 
            * visualCella richiama il giorno today
            */
            const [yearStr, monthStr, dayStr] = this.date.split('/');
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);

            // Richiama il metodo visualCella
            this.visualCella(day, month, year);
        }

        this.showTabRes = false;

        event.stopPropagation(); // Evita che l'evento si propaghi al documento
    }
    
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        // Deseleziona se si clicca al di fuori della lista
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-handleView')) {
            this.visMenu = false;
        }
    }
    
    selectVis(): void {
        this.visMenu = !this.visMenu;
    }

    getResourceTitle(listSlot: SlotPrenotazioneList[] | undefined, id: number) {
        return listSlot?.find(slot => slot.id === id)?.resource.title;
    }
}
