import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBackofficeComponent } from './landing-backoffice.component';

describe('LandingBackofficeComponent', () => {
  let component: LandingBackofficeComponent;
  let fixture: ComponentFixture<LandingBackofficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingBackofficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
