import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
import { GroupService } from '../services/group.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Group } from '../../landing-calendario/interfaces/backoffice';

@Component({
  selector: 'app-list-group',
  imports: [NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css',
})
export class GroupsListComponent {
  groups: any[] = [];
  filteredGroup: any[] = [];
  searchTerm: string = '';

  constructor(private service: GroupService, private router: Router) {}

   ngOnInit() {
      this.service.findAll().subscribe((data: Group[]) => {
        this.groups = data;
        this.filteredGroup = data; // Inizialmente, tutti gli utenti sono mostrati
      });
    }

  get arrayGroup() {
    return this.service.arrayGroup;
  }

  edit(group: Group) {
    this.router.navigateByUrl(`backoffice/group/${group.id}`);
  }

  delete(group: Group) {
    let result = this.service.delete(group);
    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }

  searchGroup() {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredGroup = this.groups.filter(groups =>
        groups.nome.toLowerCase().includes(term) ||
        groups.ruoli.some((role: any) => role.nome.toLowerCase().includes(term)) ||
        groups.utenti.some((user: any) => user.username.toLowerCase().includes(term))
      );
    } else {
      this.filteredGroup = this.groups;
    }
  }

  
}
