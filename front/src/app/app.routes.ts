import { Routes } from '@angular/router';
import { CaissePage } from './caisse/caisse-page/caisse-page';
import { LoginPage } from './login/login-page/login-page';
import { authGuard } from './auth/auth.guard';

// TODO étape 1 : déclarer les routes
//   /login  -> page de connexion
//   /caisse -> page de caisse (réservée aux utilisateurs connectés, étape 2)
//   ''  et toute autre URL -> redirection vers /caisse
export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'caisse', component: CaissePage, canActivate: [authGuard] },
  { path: '', redirectTo: 'caisse', pathMatch: 'full' },
  { path: '**', redirectTo: 'caisse' },
];

