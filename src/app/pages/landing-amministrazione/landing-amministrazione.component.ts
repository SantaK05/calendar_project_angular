import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-landing-amministrazione',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './landing-amministrazione.component.html',
  styleUrl: './landing-amministrazione.component.css',
})
export class LandingAmministrazioneComponent implements OnInit, AfterViewInit {
  isSlotView: boolean = false;
  queryEvent: Subject<string> = new Subject();
  constructor(private router: ActivatedRoute) {}
  ngAfterViewInit(): void {
    this.isSlotView =
      this.router.snapshot.queryParamMap.get('slots') === 'view';
  }

  ngOnInit(): void {}
}
