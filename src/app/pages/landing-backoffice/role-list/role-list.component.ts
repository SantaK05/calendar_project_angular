import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Role } from '../../landing-calendario/interfaces/backoffice';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../services/role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-role',
  standalone:true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class ListRoleComponent {
  role: any[] = [];
  filteredRole: any[] = [];
  searchTerm: string = '';

  constructor(private service: RoleService, private router: Router) {}

  ngOnInit() {
    this.service.findAll().subscribe((data: Role[]) => {
      this.role = data;
      this.filteredRole = data;
    });
  }

  get arrayRole() {
    return this.service.arrayRole;
  }

  edit(role: Role) {
    this.router.navigateByUrl(`backoffice/role/${role.id}`);
  }

  delete(role: Role) {
    let result = this.service.delete(role);

    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }

  searchRole() {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredRole = this.role.filter((role) =>
        role.nome.toLowerCase().includes(term)
      );
    } else {
      this.filteredRole = this.role;
    }
  }
}
