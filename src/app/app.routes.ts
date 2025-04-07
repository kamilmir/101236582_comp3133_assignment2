import { Routes } from '@angular/router';  // Import Routes
import { RegistrationComponent } from './registration/registration.component'; // Import your components
import { LoginComponent } from './login/login.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';

// Define your app's routing
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegistrationComponent }, 
  { path: 'dashboard', component: EmployeeListComponent },
  { path: 'create', component: EmployeeCreateComponent },
  { path: 'edit/:id', component: EmployeeEditComponent },
  { path: 'show/:id', component: EmployeeShowComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/login' },
];
