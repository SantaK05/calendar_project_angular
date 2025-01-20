import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';
import { CellComponent } from './pages/landing-calendario/cell/cell.component';
import { LandingAmministrazioneComponent } from './pages/landing-amministrazione/landing-amministrazione.component';
import { DashboardComponent } from './pages/landing-amministrazione/dashboard/dashboard.component';
import { SlotsComponent } from './pages/landing-amministrazione/slots/slots.component';
import { ResourcesComponent } from './pages/landing-amministrazione/resources/resources.component';
import { ResourceEditComponent } from './pages/landing-amministrazione/resource-edit/resource-edit.component';
import { SlotEditComponent } from './pages/landing-amministrazione/slot-edit/slot-edit.component';
import { LoginComponent } from './pages/landing-autenticazione/login/login.component';
import { RegisterComponent } from './pages/landing-autenticazione/register/register.component';
import { ResetPasswordComponent } from './pages/landing-autenticazione/reset-password/reset-password.component';
import { VerifyEmailComponent } from './pages/landing-autenticazione/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/landing-autenticazione/forgot-password/forgot-password.component';
import { ListUserComponent } from './pages/landing-backoffice/user-list/user-list.component';
import { GroupsListComponent } from './pages/landing-backoffice/group-list/group-list.component';
import { GroupsComponent } from './pages/landing-backoffice/group/group.component';
import { ListRoleComponent } from './pages/landing-backoffice/role-list/role-list.component';
import { RoleComponent } from './pages/landing-backoffice/role/role.component';
import { UserComponent } from './pages/landing-backoffice/user/user.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'calendario',
    component: LandingCalendarioComponent,
    children: [{ path: ':year/:month/:day', component: CellComponent }],
    canActivate: [AuthGuard]
  },
  { path: 'template', component: TemplateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword/:uuid', component: ResetPasswordComponent },
  { path: 'backoffice', redirectTo: '/backoffice/user-list', pathMatch: 'full' },
  { path: 'backoffice/user-list', component: ListUserComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/role-list', component: ListRoleComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/role', component: RoleComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/role/:id', component:RoleComponent, canActivate: [AuthGuard]},
  { path: 'backoffice/group-list', component: GroupsListComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/group', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'backoffice/group/:id', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'verify/:uuid', component: VerifyEmailComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  {
    path: 'amministrazione',
    component: LandingAmministrazioneComponent,
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'slots',
        component: SlotsComponent,
      },
      {
        path: 'resources',
        component: ResourcesComponent,
      },
      { path: 'resources/:id/edit', component: ResourceEditComponent },
      { path: 'slots/:id/edit', component: SlotEditComponent },
    ],
    canActivate: [AuthGuard]
  },
];
