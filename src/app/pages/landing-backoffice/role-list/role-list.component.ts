import { Component } from '@angular/core';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Role } from '../../../interfaces/backoffice';

@Component({
  selector: 'app-list-role',
  imports: [],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class ListRoleComponent {
  constructor(private service: RoleService, private router: Router) {}

  get arrayRole() {
    return this.service.arrayRole;
  }

  edit(role: Role) {
    this.router.navigateByUrl(`/role/${role.id}`);
  }

  delete(role: Role) {
    let result = this.service.delete(role);

    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }
}
