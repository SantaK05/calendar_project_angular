import { Component, Input } from '@angular/core';

@Component({
  selector: 'square-btn',
  imports: [],
  templateUrl: './square-btn.component.html',
  styleUrl: './square-btn.component.css'
})

export class SquareBtnComponent {
    @Input() className!: string;
}
