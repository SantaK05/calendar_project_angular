import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LandingLoginComponent {
  email = "";
  password ="";
  base_url = "http://172.16.31.32:8081/auth/login";
  constructor(private client:HttpClient) {
  }

  Login(){
    this.client.post(this.base_url,{email:this.email,password:this.password}).subscribe(data=>console.log(data));
  }
}
