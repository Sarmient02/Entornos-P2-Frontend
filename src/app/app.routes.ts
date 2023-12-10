import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { AppComponent } from './app.component';
import { loggedGuard } from './guards/logged.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routes').then(m => m.routes),
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes),
        canActivate: [loggedGuard],
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes),
        canActivate: [adminGuard],
    },
    {
        path: 'users',
        loadChildren: () => import('./modules/users/users.routes').then(m => m.routes),
        canActivate: [adminGuard],
    },
    {
        path: 'posts',
        loadChildren: () => import('./modules/post/post.routes').then(m => m.routes),
    }
];