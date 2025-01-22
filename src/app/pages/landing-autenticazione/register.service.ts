import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  backofficeUrl: string = "http://localhost:8080/backoffice/users";

  checkEmailExists(email: string) {
    return this.client.get(`${this.backofficeUrl}/email/${email}`);
  }

  checkUsernameExists(username: string) {
    return this.client.get(`${this.backofficeUrl}/username/${username}`);
  }

  constructor(private client: HttpClient) {

  }

  register() {
    console.log(this.email);
    // return this.client.post("http://localhost:8080/auth/registration", {email:this.email, name:this.nome, surname:this.cognome, username:this.username, password:this.password});

    let utente = {"email":this.email, "name":this.nome, "surname":this.cognome, "username":this.username, "password":this.password};
    return this.client.post("http://localhost:8080/auth/registration", utente);
  }


  email = "";
  nome = "";
  cognome = "";
  username = "";
  password = "";

  private componentSubject: Subject<string> = new Subject();

  changeComponent(component: string) {
    this.componentSubject.next(component)
  }

  get subject() { return this.componentSubject }

}
