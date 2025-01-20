import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../message.service';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = "";
  password = "";

  constructor(private messageService: MessageService, private client: HttpClient, private router: Router, private loginService: LoginService) {

  }

  login() {
    this.loginService.login(this.email, this.password).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.messageService.publishError("Credenziali non valide");
          this.password = "";
        } else {
          this.messageService.publishError("Errore nell'autenticazione, riprova più tardi");
        }
        return throwError(() => err);
      })
    ).subscribe();
  }
}
