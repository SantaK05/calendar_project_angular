import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, delay, switchMap, throwError, timer } from 'rxjs';
import { Resource } from '../models/resource.model';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-resources',
  imports: [RouterLink],
  templateUrl: './resources.component.html',
  styleUrl: `./resources.component.css`,
})
export class ResourcesComponent {
  arrayResources: Resource[] | null = null;
  isOpen: boolean = false;
  currentItemOnModal: number | undefined;

  constructor(private resourceService: ResourcesService) {
    this.resourceService.doAll().subscribe((data) => {
      this.arrayResources = data;
    });
  }

  closeModal() {
    this.isOpen = false;
  }

  openModal(id: number) {
    window.scroll({
      top: 0,
      left: 0,
    });

    this.isOpen = true;
    this.currentItemOnModal = id;
  }

  delete() {
    if (this.currentItemOnModal) {
      this.resourceService
        .doDelete(this.currentItemOnModal)
        .pipe(
          catchError((err) => {
            console.log('Err', err);
            return throwError(() => err);
          }),
          switchMap((data) => {
            return this.resourceService.doAll();
          })
        )
        .subscribe((data: any) => {
          this.arrayResources = data;
        });
      this.isOpen = false;
    }
  }
  exportExcel() {
    this.resourceService.exportExcel();
  }
}