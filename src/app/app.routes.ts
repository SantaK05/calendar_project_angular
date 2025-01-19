import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';
import { CellComponent } from './pages/landing-calendario/cell/cell.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/calendario', pathMatch: 'full' },
    { path: 'calendario', component: LandingCalendarioComponent, 
        children: [
            { path: ':year/:month/:day', component: CellComponent },
        ]
    },
    { path: 'email-list', component: EmailListComponent },
    { path: 'template', component: TemplateComponent },
];