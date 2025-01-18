import { Component, Input } from '@angular/core';
import { CalendarioService } from '../../pages/landing-calendario/calendario.service';

@Component({
  selector: 'square-btn',
  imports: [],
  templateUrl: './square-btn.component.html',
  styleUrl: './square-btn.component.css'
})

export class SquareBtnComponent {
  @Input() className!: string;

  constructor(private readonly service: CalendarioService) { }

    incMese() {
        this.service.incMese();
    }

    decMese() {
        this.service.decMese();
    }

    incGiorno() {
        // this.service.incGiorno();
    }

    decGiorno() {
        // this.service.decGiorno();
    }
}
