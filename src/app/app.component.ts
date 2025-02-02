import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SideBarComponent } from './resumable/side-bar/side-bar.component';
import { LoginMessageComponent } from './pages/landing-autenticazione/login-message/login-message.component';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent, LoginMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  showBar = false;
  isAmministrazione: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        let currentPath = event.urlAfterRedirects;
        this.showBar = !(currentPath == "/login" || currentPath == "/register" || currentPath == "/forgotpassword" || currentPath.includes("resetpassword") || currentPath.includes("verify") || currentPath == "/template");
      });
  }

}
