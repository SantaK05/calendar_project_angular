import { Routes } from "@angular/router";
import { GroupsListComponent } from "./group-list/group-list.component";
import { GroupsComponent } from "./group/group.component";
import { ListRoleComponent } from "./role-list/role-list.component";
import { RoleComponent } from "./role/role.component";
import { ListUserComponent } from "./user-list/user-list.component";
import { UserComponent } from "./user/user.component";

export const BackofficeRoutes: Routes = [
  {
    path:'',
    component:ListUserComponent,
  },
  {
    path: 'user-list',
    component: ListUserComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'user/:id',
    component: UserComponent,
  },
  {
    path: 'role-list',
    component: ListRoleComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'role/:id',
    component: RoleComponent,
  },
  {
    path: 'group-list',
    component: GroupsListComponent,
  },
  {
    path: 'group',
    component: GroupsComponent,
  },
  {
    path: 'group/:id',
    component: GroupsComponent,
  }



];
