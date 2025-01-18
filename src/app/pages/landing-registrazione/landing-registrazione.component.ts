import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
interface RegistrationUser {
  email:string,
  password:string,
  username:string,
  nome:string,
  cognome:string,
  confirmPassword:string,
}

@Component({
  selector: 'app-landing-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class LandingRegisterComponent {

  nome:string="";
  cognome:string="";
  email:string="";
  username:string="";
  password: string = "";
  confirmPassword:string="";
  show: boolean = false;

  base_url = "http://localhost:8081/registration/register";

  constructor(private client: HttpClient, private router: Router) {
    
  }

  Register() {
    this.client.post(this.base_url,{
      nome:this.nome,
      cognome:this.cognome,
      email:this.email,
      username:this.username,
      password:this.password,
      confirmPassword:this.confirmPassword
    }).pipe(
      catchError(error=>{
        console.log(error);
        return of(error);
      })).subscribe(response=>{
        // if(response){
        //   this.router.navigate(["/success"])
        // }
        }
      )
  }

  OnFocus() {
    this.show = true;
  }

  OnBlur() {
    if (!this.password) {
      this.show = false;
    }
  }

  hasNumber(): boolean {
    return /\d/.test(this.password);
  }
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password)
  }
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password)
  }
  hasSpecial(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(this.password)
  }

  PassowrdChanged() {
  }
}
