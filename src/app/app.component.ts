import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SquareBtnComponent } from './resumable/square-btn/square-btn.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SquareBtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
    title = 'calendario';
    isClassAdded = false;
    
    toggleClass(event: Event) {
        this.isClassAdded = !this.isClassAdded;
        event.stopPropagation();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        this.isClassAdded = false;
    }
}
