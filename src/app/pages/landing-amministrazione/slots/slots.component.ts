import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Slot } from '../models/slot.model';
import { SlotsService } from '../services/slots.service';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-slots',
  imports: [DatePipe, RouterLink],
  templateUrl: './slots.component.html',
  styleUrl: `./slots.component.css`,
})
export class SlotsComponent {
  arraySlot: Slot[] | null = null;
  isOpen: boolean = false;
  isExportComplete: boolean = false;
  exportErrorMessage: string = '';
  currentItemOnModal: number | undefined;

  constructor(private slotService: SlotsService) {
    this.slotService.doAll().subscribe((data) => {
      this.arraySlot = data;
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
    this.slotService.doExport().subscribe((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `export-slots-${new Date().toLocaleDateString()}.xlsx`; // Nome personalizzato
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
      this.slotService
        .doDelete(this.currentItemOnModal)
        .pipe(
          catchError((err) => {
            console.log('Err', err);
            return throwError(() => err);
          }),
          switchMap((data: any) => {
            return this.slotService.doAll();
          })
        )
        .subscribe((data: any) => {
          this.arraySlot = data;
        });
      this.isOpen = false;
    }
  }
}
