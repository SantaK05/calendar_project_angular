import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Slot } from '../models/slot.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from '../models/resource.model';
import { ResourcesService } from '../services/resources.service';
import { SlotsService } from '../services/slots.service';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Component({
  selector: 'app-slot-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './slot-edit.component.html',
  styleUrl: `./slot-edit.component.css`,
})
export class SlotEditComponent {
  currentTypeOfFrom: string = 'Modifica';
  resourcesResults: Resource[] | undefined;
  currentSlot: Slot | undefined;
  slotForm: FormGroup | undefined;
  findedResource: Resource | undefined;
  autocompleteClosed: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private slotService: SlotsService,
    private navigator: Router,
    private resourceService: ResourcesService
  ) {
    this.router.paramMap.subscribe((params) => {
      let id = Number(params.get('id'));
      if (id) {
        this.slotService.doSingle(id).subscribe((data) => {
          this.currentSlot = data;
          this.slotForm = new FormGroup({
            id: new FormControl({ value: this.currentSlot.id, disabled: true }),
            title: new FormControl(this.currentSlot.title, Validators.required),
            dateStart: new FormControl(
              this.currentSlot.dateStart,
              Validators.required
            ),
            dateEnd: new FormControl(
              this.currentSlot.dateEnd,
              Validators.required
            ),
            note: new FormControl(this.currentSlot.note),
            free: new FormControl(this.currentSlot.free, Validators.required),
            resource: new FormControl(
              this.currentSlot.resource.title,
              Validators.required
            ),
          });
        });
      } else {
        this.currentTypeOfFrom = 'Salva';
        this.slotForm = new FormGroup({
          id: new FormControl({ value: '', disabled: true }),
          title: new FormControl('', Validators.required),
          dateStart: new FormControl('', Validators.required),
          dateEnd: new FormControl('', Validators.required),
          note: new FormControl(''),
          free: new FormControl('', Validators.required),
          resource: new FormControl('', Validators.required),
        });
      }
    });
  }

  async saveSlot() {
    let formData = this.slotForm;
    let id = Number(this.router.snapshot.paramMap.get('id'));
    if (formData?.valid && id) {
      this.slotService
        .doEdit({
          id: formData?.get('id')?.value,
          title: formData?.get('title')?.value,
          dateStart: formData?.get('dateStart')?.value,
          dateEnd: formData?.get('dateEnd')?.value,
          note: formData?.get('note')?.value,
          free: formData?.get('free')?.value,
          resource: await this.filterResource(formData.get('resource')?.value),
        })
        .pipe(
          catchError((err) => {
            console.log('Errore', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.navigator.navigate(['/amministrazione/slots']);
          },
          error: (err: any) => {
            console.log('Errore', err);
          },
        });
    } else if (formData?.valid) {
      this.slotService
        .doSave({
          id: formData?.get('id')?.value,
          title: formData?.get('title')?.value,
          dateStart: formData?.get('dateStart')?.value,
          dateEnd: formData?.get('dateEnd')?.value,
          note: formData?.get('note')?.value,
          free: formData?.get('free')?.value,
          resource: await this.filterResource(formData.get('resource')?.value),
        })
        .pipe(
          catchError((err) => {
            console.log('Errore', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.navigator.navigate(['/amministrazione/slots']);
          },
          error: (err: any) => {
            console.log('Errore', err);
          },
        });
    }
  }

  async filterResource(title: string): Promise<Resource> {
    let remoteResources = await lastValueFrom(this.resourceService.doAll());
    let findedResource = remoteResources.find((r) => r.title === title);
    if (findedResource) {
      return findedResource;
    } else {
      return Promise.reject('Not found');
    }
  }

  searchResource() {
    this.autocompleteClosed = false;
    let inputValue = this.slotForm?.get('resource')?.value;
    this.resourceService.doAll().subscribe((data) => {
      this.resourcesResults = data.filter((r) => {
        return r.title.toLowerCase().includes(inputValue.toLowerCase());
      });
    });
  }

  setSelectedValue(e: Resource) {
    this.slotForm?.patchValue({
      resource: e.title,
    });
    this.autocompleteClosed = true;
  }
}