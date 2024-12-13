import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { catchError, map, Subject, switchMap, throwError } from 'rxjs';
import { AmministrazioneService } from './amministrazione.service';
import { Slot } from './model/slots.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-landing-amministrazione',
  imports: [RouterLink, RouterOutlet, DatePipe],
  templateUrl: './landing-amministrazione.component.html',
  styleUrl: './landing-amministrazione.component.css',
})
export class LandingAmministrazioneComponent {
  arraySlots: Slot[] | undefined;

  isSlotView: boolean = false;
  queryEvent: Subject<string> = new Subject();
  constructor(
    private router: ActivatedRoute,
    private navigator: Router,
    private service: AmministrazioneService
  ) {
    this.router.queryParamMap
      .pipe(
        map((data) => {
          if (data.get('slots') === 'view') {
            this.isSlotView = true;
            this.service.slots
              .pipe(
                catchError((err) => {
                  console.log('Errore', err);
                  return throwError(err);
                })
              )
              .subscribe((data) => (this.arraySlots = data));
          } else if (data.get('slots') === null) {
            this.isSlotView = false;
            this.arraySlots = undefined;
          }
        })
      )
      .subscribe();
  }

  changeToSlotList(): void {
    this.navigator.navigate(['/amministrazione'], {
      queryParams: { slots: 'view' },
    });
  }

  changeToHome(): void {
    this.navigator.navigateByUrl('/amministrazione');
  }
}
