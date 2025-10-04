import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';

export const routes: Routes = [
    {
    path: '',
    component: Home,
  },
  {
    path: '**',
    component: NotFound,
  },
];