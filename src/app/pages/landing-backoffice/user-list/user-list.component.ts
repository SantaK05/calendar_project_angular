import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from '../../../interfaces/backoffice';
import { NavbarComponent } from "../navbar/navbar.component";
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class ListUserComponent {
  constructor(private service: UserService, private router: Router) {}

  get arrayUser() {
    console.log(this.service.arrayUser);
    return this.service.arrayUser;
  }

  edit(user: User) {
    this.router.navigateByUrl(`backoffice/user/${user.id}`);
  }

  delete(user: User) {
    let result = this.service.delete(user);
    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }
}
