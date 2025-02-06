import { AfterContentChecked, AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
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

export class LandingCalendarioComponent implements AfterViewInit, AfterContentChecked {
    calendario!: Calendario | null;
    monthLong: string = '';
    year: number = 0;
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];
    
    tipoVis: string | null = '';
    date: string | null = '';

    showTabRes: boolean = false;

    ngAfterViewInit() {
        this.applyColors();

        this.divs.changes.subscribe(() => {
            this.applyColors();
        });
    }

    @ViewChildren('prenotazioneCella') divs!: QueryList<ElementRef>;

    applyColors() : void {
        if (this.divs) {
            this.divs.forEach(div => {
                div.nativeElement.style.backgroundColor = this.randomColor();
            });
        }
    }

    randomColor(): string {
        const r = Math.floor(Math.random() * 100); // Rosso basso (0-100)
        const g = Math.floor(Math.random() * 50);  // Verde molto basso (0-50)
        const b = Math.floor(150 + Math.random() * 105); // Blu alto (150-255)

        return `rgb(${r}, ${g}, ${b})`;
    }
    
    ngAfterContentChecked(): void {
        if (this.date == null) {
            this.date = localStorage.getItem('today');
        }
    }
    
    constructor(private readonly service: CalendarioService, private readonly router: Router) { 
        // Recupera la vista selezionata
        if (this.tipoVis == '') {
            this.tipoVis = localStorage.getItem('selectedView');
        }

        if (this.tipoVis === 'MENSILE' || (this.tipoVis == 'GIORNALIERO' && !this.calendario)) {
            this.service.getCalendarioCompleto(this.service.yearNum, this.service.monthNum, '');            
        }

        this.service.selectedView.subscribe((view) => {
            this.tipoVis = view;
        });

        if (this.tipoVis == 'MENSILE') {
            this.service.getCalendarioCompleto(this.service.yearNum, this.service.monthNum, '');
        }

        this.service.calendario$.subscribe((updatedCalendario) => {
            if (this.tipoVis != "GIORNALIERO" || updatedCalendario?.provenienza !== 'visualBtn') {
                this.calendario = updatedCalendario;
                this.monthLong = updatedCalendario?.data ? new Intl.DateTimeFormat("en-US", { month: 'long' }).format(new Date(updatedCalendario.data)) : '';
                this.year = updatedCalendario?.data ? new Date(updatedCalendario.data).getFullYear() : 0;

                this.service.listGiorni$.subscribe((updatedListGiorni) => {
                    this.listGiorni = updatedListGiorni;
                });
            }
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

        if (this.calendario?.data) {
            console.info(`Calendario aggiornato: ${this.calendario.data}`);
        }
    }

    visualCella(day: number, month: number, year: number): void {
        let targetMonth = month + 1;
        let targetYear = year;

        this.service.changeView("GIORNALIERO"); // Notifica il cambio di vista
        this.router.navigateByUrl(`calendario/${targetYear}/${targetMonth}/${day}`);
    }

    changeTabRes() {
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
