
import { RegisterService } from '../register.service';
import { CustomValidators } from '../CustomValidators';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-name-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.css'
})
export class NameFormComponent implements OnInit {
  constructor(private service: RegisterService,private formBuilder: FormBuilder) {
    service.subject.subscribe()
  }
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // il primo parametro è il valore di default
      // il secondo parametro è un array di validazioni
      // il terzo parametro è un array di validazioni asincrone
      nome: ['', [Validators.compose([Validators.required])]],
      cognome: ['', [Validators.compose([Validators.required])]],
      username: ['', [Validators.compose([Validators.required])],[CustomValidators.checkUsernameExists(this.service)]]
      /*,
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
    this.nome=this.service.nome;
    this.cognome=this.service.cognome;
    this.username=this.service.username;
  }

  nome = "";
  cognome = "";
  username = "";

  changeComponent(component: string) {
    this.service.nome = this.nome;
    this.service.cognome = this.cognome;
    this.service.username = this.username;
    this.service.changeComponent(component);
  }

  get usernameErrors() {
    return this.form.get('username')?.errors;
  }

}
