
import { RegisterService } from '../register.service';
import { CustomValidators } from '../CustomValidators';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-name-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.css'
})
export class NameFormComponent implements OnInit {
  constructor(private service: RegisterService, private formBuilder: FormBuilder, private messageService: MessageService) {
    service.subject.subscribe()
  }
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.compose([Validators.required])]],
      cognome: ['', [Validators.compose([Validators.required])]],
      username: ['', [Validators.compose([Validators.required])], [CustomValidators.checkUsernameExists(this.service, this.messageService)]]
    },
    )
    this.nome = this.service.nome;
    this.cognome = this.service.cognome;
    this.username = this.service.username;
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
