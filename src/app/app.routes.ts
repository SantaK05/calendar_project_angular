import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/calendario', pathMatch: 'full' },
    { path: 'calendario', component: LandingCalendarioComponent },
    { path: 'email-list', component: EmailListComponent },
    { path: 'template', component: TemplateComponent },

];