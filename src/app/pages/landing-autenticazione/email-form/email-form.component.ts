
import { RegisterService } from '../register.service';

import { CommonModule } from '@angular/common';
import { CustomValidators } from '../CustomValidators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-email-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.css'
})
export class EmailFormComponent {

  form!: FormGroup;

  constructor(private service: RegisterService, private formBuilder: FormBuilder,private messageService:MessageService) {
    service.subject.subscribe()
  }

  email = "";

  changeComponent() {
    this.service.email = this.email;
    this.service.changeComponent("name-component");
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      email: ['', [Validators.compose([Validators.required, Validators.email])], [CustomValidators.checkEmailExists(this.service,this.messageService)]]
    },
    )
    this.email = this.service.email;
  }
  get emailErrors() {
    return this.form.get('email')?.errors;
  }
}
