import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
    {
      path: '',
      component: DashboardComponent,
      children: [
        {
            path: '',
            redirectTo: '/admin/users',
            pathMatch: 'full'
        },
        {
            path: 'users',
            loadChildren: () => import('./../users/users.routes').then(m => m.routes),
        }
      ]
    }
];