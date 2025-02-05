import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  isExportComplete: boolean = false;
  exportErrorMessage: string = '';
  currentItemOnModal: number | undefined;

  constructor(private resourceService: ResourcesService) {
    this.resourceService.doAll().subscribe((data) => {
      this.arrayResources = data;
    });
  }

  closeModal() {
    this.isOpen = false;
    this.isExportComplete = false;
  }

  openSucsessExportModal() {
    window.scroll({
      top: 0,
      left: 0,
    });

    this.isExportComplete = true;
  }

  openModal(id: number) {
    window.scroll({
      top: 0,
      left: 0,
    });

    this.isOpen = true;
    this.currentItemOnModal = id;
  }

  executeExport() {
    this.resourceService.doExport().subscribe((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `export-risorse-${new Date().toLocaleDateString()}.xlsx`; // Nome personalizzato
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Rilascia memoria
      window.URL.revokeObjectURL(url);

      this.isExportComplete = false;
    });
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
}
