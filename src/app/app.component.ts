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
    activeButtonId: string | null = null;
    
    handleButtonClick(event: Event, buttonId: string) {
        if (this.activeButtonId === buttonId) {
            this.activeButtonId = null;
        } else {
            this.activeButtonId = buttonId;
        }
        event.stopPropagation();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.activeButtonId !== "sb-shower") {
            this.activeButtonId = null;
        }
    }

    isButtonActive(buttonId: string): boolean {
        return this.activeButtonId === buttonId;
    }
}
