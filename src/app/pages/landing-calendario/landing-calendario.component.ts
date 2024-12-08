import { Component, OnInit } from '@angular/core';
import { Calendario } from '../../interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";
import { CalendarioService } from './calendario.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-calendario',
  imports: [CommonModule, SquareBtnComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent implements OnInit {
    calendario!: Calendario;
    dataObj = new Date();
    year: number = 0;
    monthLong: string = '';
    
    constructor(private readonly service: CalendarioService) { }
    
    ngOnInit(): void {
        console.log('caricamento DOM');
        this.getCalendarioCompleto();
    }

    obsCalendar!: Observable<Calendario>; 
    result!: Calendario;
    
    getCalendarioCompleto() {
        // Chimata per ricevere il calendario
        this.obsCalendar = this.service.getCalendarioJSON(this.dataObj.getFullYear(), this.dataObj.getMonth() + 1);
        this.obsCalendar.subscribe((data) => {
            this.result = data;
            console.info(`Data del calendario selezionato: ${this.result.data}`);
        });

        this.dataObj = new Date(this.result.data);
        this.year = this.dataObj.getFullYear();
        this.monthLong = new Intl.DateTimeFormat("en-US", { month: 'long' }).format(this.dataObj);
    }
}
