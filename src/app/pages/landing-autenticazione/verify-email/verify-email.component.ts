import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit{
  uuid = ""
  constructor(private client: HttpClient, private messageService: MessageService, private activatedRoute: ActivatedRoute, private router: Router) {
    let id = this.activatedRoute.snapshot.paramMap.get('uuid');
    if (id == null) {
      messageService.publishError("Link non valido");
    } else {
      this.uuid = id;
    }
  }

  ngOnInit(): void {
    this.client.post("http://localhost:8080/verify/" + this.uuid, {}).pipe(
      catchError((err) => {
        if (err.status == 401) {
          this.messageService.publishError("Link scaduto");
          this.router.navigateByUrl("/register");
        } else {
          this.messageService.publishError("Problema interno, riprova più tardi");
        }
        return throwError(() => err);
      }),
      tap(() => {
        this.messageService.publishInfo("Email verificata con successo");
        this.router.navigateByUrl("/login");
      })
    ).subscribe();
  }
}
