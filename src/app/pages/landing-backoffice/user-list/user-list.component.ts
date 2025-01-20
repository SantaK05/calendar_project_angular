import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { switchMap } from 'rxjs';
import { User } from '../../../interfaces/backoffice';
import { NavbarComponent } from "../navbar/navbar.component";
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class ListUserComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  showIcon: boolean = true;

  constructor(private service: UserService, private router: Router) {}

  ngOnInit() {
    this.service.findAll().subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = data; // Inizialmente, tutti gli utenti sono mostrati
    });
  }

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

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredUsers = this.users.filter(user =>
        user.nome.toLowerCase().includes(term) ||
        user.cognome.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
      );
    } else {
      this.filteredUsers = this.users;
    }
  }
}
