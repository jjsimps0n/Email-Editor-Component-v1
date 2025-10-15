import { Routes } from '@angular/router';
import { EmailBuilder } from './components/email-builder/email-builder';

export const routes: Routes = [
  { path: '', redirectTo: 'editor', pathMatch: 'full' },
  {
    path: 'editor',
    loadComponent: () =>
      import('./components/email-builder/email-builder')
        .then(m => m.EmailBuilder)
  }
];
