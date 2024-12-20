import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../role.service';
import { Role } from '../../../interfaces/backoffice';
import { MessageService } from '../message.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-role',
  imports: [FormsModule, NavbarComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent {
  current: Role = {
    id: 0,
    nome: '',
    descrizione: '',
  };

  triggerNavigation: boolean = false;

  constructor(
    private service: RoleService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.service
        .load(id)
        .pipe(
          tap((data) => {
            console.log('ottenuti dati ruoli');
            console.log(data);
            this.current = data as Role;
          }),
          catchError((err) => {
            console.log(err);
            this.messageService.publishError('Errore caricamento dati.');
            return throwError(() => err);
          })
        )
        .subscribe();
    }
  }

  save() {
    this.service.save(this.current).pipe(
      switchMap((response) => {
        return this.service.findAll();
      }),
      tap((data: any) => {
        this.router.navigateByUrl('backoffice/role-list');
      })
    ).subscribe();
  }
}
