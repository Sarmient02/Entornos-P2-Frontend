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
      },
      {
        path: 'users/new',
        loadChildren: () => import('./../users/users.routes').then(m => m.routes),
      },
      {
        path: '',
        redirectTo: '/admin/subjects',
        pathMatch: 'full'
      },
      {
        path: 'subjects',
        loadChildren: () => import('./../subjects/subjects.routes').then(m => m.routes),
      },
      {
        path: 'subjects/new',
        loadChildren: () => import('./../subjects/subjects.routes').then(m => m.routes),
      },
      {
        path: '',
        redirectTo: '/admin/careers',
        pathMatch: 'full'
      },
      {
        path: 'careers',
        loadChildren: () => import('./../careers/careers.routes').then(m => m.routes),
      },
      {
        path: 'careers/new',
        loadChildren: () => import('./../careers/careers.routes').then(m => m.routes),
      }
    ]
  }
];