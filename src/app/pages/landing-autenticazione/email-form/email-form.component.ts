
import { RegisterService } from '../register.service';

import { CommonModule } from '@angular/common';
import { CustomValidators } from '../CustomValidators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-form',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.css'
})
export class EmailFormComponent {

  form!: FormGroup;

  constructor(private service:RegisterService,private formBuilder: FormBuilder) {
    service.subject.subscribe()
  }

email="";

  changeComponent() {
    this.service.email = this.email;
    this.service.changeComponent("name-component");
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      // il primo parametro è il valore di default
      // il secondo parametro è un array di validazioni
      // il terzo parametro è un array di validazioni asincrone
      email: ['', [Validators.compose([Validators.required, Validators.email])],[CustomValidators.checkEmailExists(this.service)]]/*,
      password: ['', [Validators.compose([
        Validators.required, 
        Validators.minLength(8),
        PasswordValidators.containsLowerCase(),
        PasswordValidators.containsUpperCase(),
        PasswordValidators.containsSpecialCharacter()
      ])]],
      confirmPassword: ['', [Validators.required]]*/
    },
    // inserisco un validatore personalizzato da applicare a tutto il form

    /*{ validators: PasswordValidators.passwordMatchValidator('password', 'confirmPassword') }*/
    )
    this.email = this.service.email;
  }
  get emailErrors() {
    return this.form.get('email')?.errors;
  }
}
