import { Routes } from '@angular/router';
import { LandingCalendarioComponent } from './pages/landing-calendario/landing-calendario.component';
import { EmailListComponent } from './pages/landing-email/list/list.component';
import { TemplateComponent } from './pages/landing-email/template/template.component';
import { CellComponent } from './pages/landing-calendario/cell/cell.component';
import { LoginComponent } from './pages/landing-autenticazione/login/login.component';
import { RegisterComponent } from './pages/landing-autenticazione/register/register.component';
import { ResetPasswordComponent } from './pages/landing-autenticazione/reset-password/reset-password.component';
import { VerifyEmailComponent } from './pages/landing-autenticazione/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/landing-autenticazione/forgot-password/forgot-password.component';

export const routes: Routes = [
    { path: '', redirectTo: '/calendario', pathMatch: 'full' },
    {
        path: 'calendario', component: LandingCalendarioComponent,
        children: [
            { path: ':year/:month/:day', component: CellComponent },
        ]
    },
    { path: 'email-list', component: EmailListComponent },
    { path: 'template', component: TemplateComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'resetpassword/:uuid', component: ResetPasswordComponent },
    { path: 'verify/:uuid', component: VerifyEmailComponent },
    { path: 'forgotpassword', component: ForgotPasswordComponent }
];
