import { CommonModule } from '@angular/common';
import { EmailFormComponent } from "../email-form/email-form.component";
import { NameFormComponent } from "../name-form/name-form.component";
import { RegisterService } from '../register.service';
import { PasswordFormComponent } from "../password-form/password-form.component";
import { Component } from '@angular/core';

@Component({
  selector: 'app-provaform',
  imports: [CommonModule, EmailFormComponent, NameFormComponent, PasswordFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  activeComponent = "email-component";

  constructor(service: RegisterService) {
    service.subject.subscribe(component => this.activeComponent = component);
  }
}
