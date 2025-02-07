import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'patients', component: PatientListComponent,canActivate: [AuthGuard] },
  { path: 'patients/:id', component: PatientDetailComponent,canActivate: [AuthGuard] },
  { path: 'patients/:id/recommendations', component: RecommendationsComponent,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' }, //
];
