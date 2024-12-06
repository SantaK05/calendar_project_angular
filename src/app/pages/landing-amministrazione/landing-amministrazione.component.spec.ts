import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingAmministrazioneComponent } from './landing-amministrazione.component';

describe('LandingAmministrazioneComponent', () => {
  let component: LandingAmministrazioneComponent;
  let fixture: ComponentFixture<LandingAmministrazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingAmministrazioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingAmministrazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
