import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';
import { LandingAmministrazioneComponent } from './pages/landing-amministrazione/landing-amministrazione.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendario', pathMatch: 'full' },
  { path: 'calendario', component: LandingCalendarioComponent },
  { path: 'email-list', component: EmailListComponent },
  { path: 'template', component: TemplateComponent },
  { path: 'amministrazione', component: LandingAmministrazioneComponent },
  {
    path: 'amministrazione?slots=view',
    component: LandingAmministrazioneComponent,
  },
];
