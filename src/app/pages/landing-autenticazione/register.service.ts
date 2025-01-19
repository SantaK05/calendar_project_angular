import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  checkEmailExists(email: string) {
    return this.client.get(`http://localhost:5000/users/email/${email}`);
  }

  checkUsernameExists(username: string) {
    return this.client.get(`http://localhost:5000/users/username/${username}`);
  }

  constructor(private client: HttpClient) {

  }

  register() {
    console.log(this.email);
    return this.client.post("http://localhost:8082/auth/registration",{email:this.email,nome:this.nome,cognome:this.cognome,username:this.username,password:this.password});
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
