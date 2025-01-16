import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MessagePayload {
    content: string,
    type: string
}

@Injectable({
  providedIn: 'root'
})

export class MessageCalendarioService {
    messageEvent: Subject<MessagePayload> = new Subject();

    constructor() { }

    publishInfo(message: string) {
        this.messageEvent.next({
          content: message,
          type: 'info'
        });
    }  

    publishWarning(message: string) {
        this.messageEvent.next({
            content: message,
            type: 'warn'
        });
    }

    publishError(message: string) {
        this.messageEvent.next({
            content: message,
            type: 'err'
        });
    }
}
