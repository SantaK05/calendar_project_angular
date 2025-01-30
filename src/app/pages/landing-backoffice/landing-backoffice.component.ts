import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-landing-backoffice',
  standalone:true,
  imports: [NavbarComponent],
  templateUrl: './landing-backoffice.component.html',
  styleUrl: './landing-backoffice.component.css'
})
export class LandingBackofficeComponent {

}
