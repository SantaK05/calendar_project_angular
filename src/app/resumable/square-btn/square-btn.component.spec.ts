import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareBtnComponent } from './square-btn.component';

describe('SquareBtnComponent', () => {
  let component: SquareBtnComponent;
  let fixture: ComponentFixture<SquareBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquareBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
