import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../pages/landing-calendario/calendario.service';
import { SquareBtnComponent } from '../square-btn/square-btn.component';

@Component({
  selector: 'side-bar',
  imports: [SquareBtnComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})

export class SideBarComponent {
    listGiorni: Array<Map<number, [boolean[], number[]]>> = [];

    constructor(private readonly service: CalendarioService, private readonly router: Router) { 
        this.service.listGiorni$.subscribe((updatedListGiorni) => {
            this.listGiorni = updatedListGiorni;
        });
    }

    visualCella(day: number, month: number, year: number): void {
        let targetMonth = month + 1;
        let targetYear = year;

        this.router.navigateByUrl(`/calendario/d/${targetYear}/${targetMonth}/${day}`);
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
    isHighlightWeek(settimana: Map<number, [boolean[], number[]]>): boolean {
        for (const giorno of settimana.values()) {
            if (giorno[0][0]) { // giorno[0][0] rappresenta `isToday`
                return true;
            }
        }
        return false;
    }
}
