import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingRegistrazioneComponent } from './landing-registrazione.component';

describe('LandingRegistrazioneComponent', () => {
  let component: LandingRegistrazioneComponent;
  let fixture: ComponentFixture<LandingRegistrazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingRegistrazioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingRegistrazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
