import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCalendarioComponent } from './landing-calendario.component';

describe('LandingCalendarioComponent', () => {
  let component: LandingCalendarioComponent;
  let fixture: ComponentFixture<LandingCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
