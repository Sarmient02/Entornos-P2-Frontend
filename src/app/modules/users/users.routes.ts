import { Routes } from '@angular/router';
import { TableComponent } from './pages/table/table.component';
import { NewComponent } from './pages/new/new.component';

export const routes: Routes = [
    {
      path: '',
      component: TableComponent
    },
    {
      path: 'new',
      component: NewComponent
    }
  ];