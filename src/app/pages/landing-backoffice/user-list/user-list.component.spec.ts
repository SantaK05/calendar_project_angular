import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
