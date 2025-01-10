import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './resumable/side-bar/side-bar.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent],  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
    
}
