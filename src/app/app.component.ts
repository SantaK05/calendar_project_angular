import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './resumable/side-bar/side-bar.component';
import { LoginMessageComponent } from './pages/landing-autenticazione/login-message/login-message.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent,LoginMessageComponent],  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
    
}
