
import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../CustomValidators';
import { CommonModule } from '@angular/common';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.css'
})
export class PasswordFormComponent implements OnInit {

  goToLogin() {
    this.router.navigateByUrl("/login");
  }

  retryRegistration() {
    this.display = "none";
    this.changeComponent("email-component");
  }
  register() {
    this.service.register().pipe(
      catchError(e => {
        this.registrationSuccess = false;
        this.display = "block"
        return throwError(() => e);
      }),
      tap(() => {
        this.registrationSuccess = true;
        this.display = "block"
      })
    ).subscribe();
    this.service.nome = "";
    this.service.cognome = "";
    this.service.email = "";
    this.service.password = "";
    this.service.username = "";
  }

  display = "none";
  registrationSuccess = false;

  constructor(private service: RegisterService, private formBuilder: FormBuilder, private router: Router) {
    service.subject.subscribe()
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // il primo parametro è il valore di default
      // il secondo parametro è un array di validazioni
      // il terzo parametro è un array di validazioni asincrone
      password: ['', [Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidators.containsLowerCase(),
        CustomValidators.containsUpperCase(),
        CustomValidators.containsSpecialCharacter()
      ])]],
      confirmPassword: ['', [Validators.required]]
    },
      // inserisco un validatore personalizzato da applicare a tutto il form
      { validators: CustomValidators.passwordMatchValidator('password', 'confirmPassword') }
    )
  }

  form!: FormGroup;

  changeComponent(component: string) {
    this.service.changeComponent(component);
  }

  get passwordErrors() {
    return this.form.get('password')?.errors;
  }

  get formErrors() {
    return this.form.errors;
  }

}
