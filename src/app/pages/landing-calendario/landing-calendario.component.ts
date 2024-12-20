import { Component, OnInit } from '@angular/core';
import { Calendario, ListaCelle } from './interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";
import { CalendarioService } from './calendario.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageCalendarioComponent } from './message-calendario/message-calendario.component';
@Component({
  selector: 'app-landing-calendario',
  imports: [CommonModule, SquareBtnComponent, MessageCalendarioComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent implements OnInit {
    calendario!: Calendario;

    monthLong: string = '';
    year: number = 0;
    

    constructor(private readonly service: CalendarioService, private router: Router) { }
    
    ngOnInit(): void {
        console.log('caricamento DOM');
        this.getCalendarioCompleto(this.service.yearNum, this.service.monthNum);
    }

    getCalendarioCompleto(year: number, month: number) {
        this.service.getCalendarioCompleto(year, month);

        this.listGiorni = this.service.listGiorni;
        this.monthLong = this.service.monthLong;
        this.year = this.service.year;
    }

    listGiorni: Array<Map<number, boolean[]>> = [];

    visualCella(giorno: number): void {
        console.log('visual cella');
        this.router.navigateByUrl(`/d/${this.service.dataObj.getUTCFullYear()}/${this.service.dataObj.getUTCMonth()}/${giorno}`);
    }
}
