import { Component } from '@angular/core';
import { MessageCalendarioService, MessagePayload } from './message-calendario.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'message-calendario',
  imports: [CommonModule],
  templateUrl: './message-calendario.component.html',
  styleUrl: './message-calendario.component.css'
})

export class MessageCalendarioComponent {
    payload?: MessagePayload;

    constructor(private service: MessageCalendarioService) {
        this.service.messageEvent.pipe(
            tap(e => {
                this.payload = e;
            })
        ).subscribe();
    }

    close() {
        this.payload = undefined;
    }

    getAlertClass() {
        if(this.payload) {
    
            switch(this.payload.type) {
                case 'info': return 'alert-info';
                case 'warn': return 'alert-warning';
                case 'err': return 'alert-danger';
            }
        }
        return '';
    }
}
