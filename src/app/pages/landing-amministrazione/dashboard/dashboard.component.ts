import { Component } from '@angular/core';
import { SlotsService } from '../services/slots.service';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  totalSlot: number | null = null;
  totalResources: number | null = null;
  slotsAvailable: number | null = null;
  resourcesAvailable: number | null = null;

  constructor(
    private slotService: SlotsService,
    private resourceService: ResourcesService
  ) {
    this.slotService.doAll().subscribe((data) => {
      this.totalSlot = data.length;
      this.slotsAvailable = data.filter((s) => s.free).length;
    });

    this.resourceService.doAll().subscribe((data) => {
      this.totalResources = data.length;
      this.resourcesAvailable = data.filter((r) => r.bookable).length;
    });
  }
}
