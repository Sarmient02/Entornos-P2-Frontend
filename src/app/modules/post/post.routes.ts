import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { ViewComponent } from './pages/view/view.component';
import { PreviewComponent } from './components/preview/preview.component';

export const routes: Routes = [
    {
        path: '',
        component: ListComponent,
        children: [
            {
                path: '',
                redirectTo: '/posts',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'new',
        component: NewComponent,
    },
    {
        path: 'edit/:id',
        component: EditComponent,
    },
    {
        path: 'view/:id',
        component: ViewComponent,
    }
];
