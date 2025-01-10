import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCalendarioComponent } from './message-calendario.component';

describe('MessageCalendarioComponent', () => {
  let component: MessageCalendarioComponent;
  let fixture: ComponentFixture<MessageCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
