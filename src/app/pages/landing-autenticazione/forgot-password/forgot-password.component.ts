import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouteReuseStrategy, RouterModule } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private client: HttpClient, private messageService: MessageService,private router:Router) {

  }
  email = "";
  conferma() {
    this.client.post("http://localhost:8081/resetemail", {}).pipe(
      catchError(err => {
        if (err.status == 400) {
          this.messageService.publishError("Email non valida");
        } else {
          this.messageService.publishError("Errore interno, riprova più tardi");
        }
        this.email="";
        return throwError(()=>err);
      }),
      tap(()=>{
        this.messageService.publishInfo("Controlla la casella di posta per resettare la password");
        this.router.navigateByUrl("/login");
      })
    ).subscribe();
  }
}
