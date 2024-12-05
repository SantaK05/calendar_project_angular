import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/calendario', pathMatch: 'full' },
    { path: 'calendario', component: LandingCalendarioComponent },
];