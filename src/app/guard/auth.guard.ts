import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../pages/landing-autenticazione/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(): boolean {
    this.loginService.checkTokenIsExpired();

    if (localStorage.getItem("jwt")) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
