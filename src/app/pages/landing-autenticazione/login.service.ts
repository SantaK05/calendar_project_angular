import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { catchError, Subject, tap, timer } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private client: HttpClient, private router: Router) {

  }

  login(email: string, password: string) {
    return this.client.post("http://localhost:8080/auth/login", { email: email, password: password }, { responseType: "text" }).pipe(
      tap((data) => {
        localStorage.setItem("jwt", data as string);
        let payload64 = data.split('.')[1];
        let payloadJSON = payload64.replace(/-/g, '+').replace(/_/g, '/');
        let jwt = JSON.parse(atob(payloadJSON))
        let currentTime = Math.floor(Date.now() / 1000);
        let expSeconds = jwt.exp - currentTime;
        timer(expSeconds*1000).subscribe(() => this.subject.next());
        this.router.navigateByUrl("/calendario")
      })
    );
  }

  subject = new Subject<void>();

  checkTokenIsExpired() {
    let jwt = localStorage.getItem("jwt")
    if (jwt) {
      let payload = jwt.split('.')[1];
      let decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      let jwtJSON = JSON.parse(decodedPayload);
      if (jwtJSON.exp - Math.floor(Date.now() / 1000) <= 0) {
        //token scaduto
        localStorage.removeItem("jwt");
      }
    }
  }

}
