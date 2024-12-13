import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../../../interfaces/backoffice';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class ListUserComponent {
  constructor(private service: UserService, private router: Router) {}

  get arrayUser() {
    return this.service.arrayUser;
  }

  edit(user: User) {
    this.router.navigateByUrl(`/form/${user.id}`);
  }

  delete(user: User) {
    let result = this.service.delete(user);
    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }
}
