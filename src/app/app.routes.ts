import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';
import { LandingBackofficeComponent } from './pages/landing-backoffice/landing-backoffice.component';
import { UserComponent } from './pages/landing-backoffice/user/user.component';
import { ListUserComponent } from './pages/landing-backoffice/user-list/user-list.component';
import { RoleComponent } from './pages/landing-backoffice/role/role.component';
import { ListRoleComponent } from './pages/landing-backoffice/role-list/role-list.component';
import { GroupsComponent } from './pages/landing-backoffice/group/group.component';
import { GroupsListComponent } from './pages/landing-backoffice/group-list/group-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendario', pathMatch: 'full' },
  { path: 'calendario', component: LandingCalendarioComponent },
  { path: 'email-list', component: EmailListComponent },
  { path: 'template', component: TemplateComponent },
  { path: 'backoffice', component: LandingBackofficeComponent },
  { path: 'backoffice/user-list', component: ListUserComponent },
  { path: 'backoffice/user', component: UserComponent },
  { path: 'backoffice/user/:id', component: UserComponent },
  { path: 'backoffice/role-list', component: ListRoleComponent },
  { path: 'backoffice/role', component: RoleComponent },
  { path: 'backoffice/role/:id', component:RoleComponent},
  { path: 'backoffice/group-list', component: GroupsListComponent },
  { path: 'backoffice/group', component: GroupsComponent },
  { path: 'backoffice/group/:id', component: GroupsComponent },
];
