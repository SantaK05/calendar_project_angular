import { Component, OnInit } from '@angular/core';
import { Calendario } from '../../interfaces/calendario';
import { SquareBtnComponent } from "../../resumable/square-btn/square-btn.component";

@Component({
  selector: 'app-landing-calendario',
  imports: [SquareBtnComponent],
  templateUrl: './landing-calendario.component.html',
  styleUrl: './landing-calendario.component.css'
})

export class LandingCalendarioComponent implements OnInit {
    calendario!: Calendario;
    
    constructor() {

    }

    ngOnInit(): void {
        console.log('caricamento DOM');
    }
}
