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

export const routes: Routes = [
  { path: '', redirectTo: '/calendario', pathMatch: 'full' },
  {
    path: 'calendario',
    component: LandingCalendarioComponent,
    children: [{ path: 'd/:year/:month/:day', component: CellComponent }],
  },
  { path: 'email-list', component: EmailListComponent },
  { path: 'template', component: TemplateComponent },
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
  },
];
