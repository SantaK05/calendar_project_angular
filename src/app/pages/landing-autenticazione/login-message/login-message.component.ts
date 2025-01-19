import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessagePayload, MessageService } from '../message.service';

@Component({
  selector: 'login-message',
  imports: [CommonModule],
  templateUrl: './login-message.component.html',
  styleUrl: './login-message.component.css'
})
export class LoginMessageComponent {


  payload?: MessagePayload;

  constructor(private service: MessageService) {

    this.service.messageEvent.pipe(
      tap(e => {

        this.payload = e;
        setTimeout(() => this.payload = undefined, 3000);

      })
    ).subscribe();
  }

  close() {
    this.payload = undefined;
  }

  getAlertClass() {

    if (this.payload) {

      switch (this.payload.type) {
        case 'info': return 'background: #7cbc94';
        case 'warn': return 'background: #fffcec';
        case 'err': return 'background: #EF665B';
      }
    }
    return '';
  }

  getIconClass() {
    if (this.payload) {

      switch (this.payload.type) {
        case 'info': return 'bx bxs-check-circle';
        case 'warn': return 'bx bx-error';
        case 'err': return 'bx bxs-error-circle';
      }
    }
    return '';
  }
}
