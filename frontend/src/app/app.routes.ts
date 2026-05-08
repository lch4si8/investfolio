import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard — InvestFolio',
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./components/portfolio/portfolio').then(m => m.Portfolio),
        title: 'Portfolio — InvestFolio',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
