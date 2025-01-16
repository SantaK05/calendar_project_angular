import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from '../models/resource.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResourcesService } from '../services/resources.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-resources-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './resource-edit.component.html',
  styleUrl: `./resource-edit.component.css`,
})
export class ResourceEditComponent {
  currentResource: Resource | undefined;
  resourceForm: FormGroup | undefined;
  currentTypeOfForm: string = 'Modifica';

  constructor(
    private router: ActivatedRoute,
    private resourceService: ResourcesService,
    private navigator: Router
  ) {
    this.router.paramMap.subscribe((params) => {
      let id = Number(params.get('id'));
      if (id) {
        this.currentTypeOfForm = 'Modifica'; // Modifica se l'ID è presente
        this.resourceService.doSingle(id).subscribe((data) => {
          this.currentResource = data;
          this.resourceForm = new FormGroup({
            id: new FormControl({
              value: this.currentResource.id,
              disabled: true,
            }),
            title: new FormControl(
              this.currentResource.title,
              Validators.required
            ),
            description: new FormControl(
              this.currentResource.description,
              Validators.required
            ),
            info1: new FormControl(this.currentResource.info1),
            info2: new FormControl(this.currentResource.info2),
            info3: new FormControl(this.currentResource.info3),
            info4: new FormControl(this.currentResource.info4),
            info5: new FormControl(this.currentResource.info5),
            remoteAccess: new FormControl(
              this.currentResource.remoteAccess,
              Validators.required
            ),
            bookable: new FormControl(
              this.currentResource.bookable,
              Validators.required
            ),
          });
        });
      } else {
        this.currentTypeOfForm = 'Aggiungi'; // Aggiungi se non c'è ID
        this.resourceForm = new FormGroup({
          id: new FormControl({ value: '', disabled: true }),
          title: new FormControl('', Validators.required),
          description: new FormControl('', Validators.required),
          info1: new FormControl(''),
          info2: new FormControl(''),
          info3: new FormControl(''),
          info4: new FormControl(''),
          info5: new FormControl(''),
          remoteAccess: new FormControl(true, Validators.required),
          bookable: new FormControl(true, Validators.required),
        });
      }
    });
  }

  saveResource() {
    let formData = this.resourceForm;
    let id = Number(this.router.snapshot.paramMap.get('id'));
    if (formData?.valid && id) {
      this.resourceService
        .doEdit({
          id: formData?.get('id')?.value,
          title: formData?.get('title')?.value,
          description: formData?.get('description')?.value,
          info1: formData?.get('info1')?.value,
          info2: formData?.get('info2')?.value,
          info3: formData?.get('info3')?.value,
          info4: formData?.get('info4')?.value,
          info5: formData?.get('info5')?.value,
          remoteAccess: formData?.get('remoteAccess')?.value,
          bookable: formData?.get('bookable')?.value,
        })
        .pipe(
          catchError((err) => {
            console.log('Errore', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.navigator.navigate(['/amministrazione/resources']);
          },
          error: (err: any) => {
            console.log('Errore', err);
          },
        });
    } else if (formData?.valid) {
      this.currentTypeOfForm = 'Aggiungi';
      this.resourceService
        .doSave({
          id: formData?.get('id')?.value,
          title: formData?.get('title')?.value,
          description: formData?.get('description')?.value,
          info1: formData?.get('info1')?.value,
          info2: formData?.get('info2')?.value,
          info3: formData?.get('info3')?.value,
          info4: formData?.get('info4')?.value,
          info5: formData?.get('info5')?.value,
          remoteAccess: formData?.get('remoteAccess')?.value,
          bookable: formData?.get('bookable')?.value,
        })
        .pipe(
          catchError((err) => {
            console.log('Errore', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.navigator.navigate(['/amministrazione/resources']);
          },
          error: (err: any) => {
            console.log('Errore', err);
          },
        });
    }
  }
}