import { Component } from '@angular/core';
import { CellComponent } from '../../pages/landing-calendario/cell/cell.component';

@Component({
  selector: 'resources',
  imports: [],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})

export class ResourcesComponent {
    listSlotPrenotazioni: Array<any> = [];

    constructor(private readonly cell: CellComponent) {
        this.listSlotPrenotazioni = this.cell.listSlotPrenotazioni;
        console.log(this.listSlotPrenotazioni)
    }
}
