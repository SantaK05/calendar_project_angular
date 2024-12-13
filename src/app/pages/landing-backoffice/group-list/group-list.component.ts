import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { GroupService } from '../group.service';
import { Group } from '../../../interfaces/backoffice';

@Component({
  selector: 'app-list-gruop',
  imports: [],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css',
})
export class GroupsListComponent {
  constructor(private service: GroupService, private router: Router) {}

  get arrayGroup() {
    return this.service.arrayGroup;
  }

  edit(group: Group) {
    this.router.navigateByUrl(`/form/${group.id}`);
  }

  delete(group: Group) {
    let result = this.service.delete(group);
    if (result) {
      result.pipe(switchMap(() => this.service.findAll())).subscribe();
    }
  }
}
