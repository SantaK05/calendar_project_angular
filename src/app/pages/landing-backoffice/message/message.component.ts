import { Component } from '@angular/core';
import { MessagePayload, MessageService } from '../message.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  payload?: MessagePayload;

  constructor(private service: MessageService) {

    this.service.messageEvent.pipe(
      tap(e => {

        this.payload = e;
        setTimeout(() => this.payload = undefined, 2000);

      })
    ).subscribe();
  }

  close() {
    this.payload = undefined;
  }

  getBootstrapAlertClass() {

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