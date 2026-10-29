import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  await auth.lista;
  return auth.sesion() ? true : router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  await auth.lista;
  const sesion = auth.sesion();
  if (!sesion) return router.createUrlTree(['/login']);
  return sesion.rol === 'admin' ? true : router.createUrlTree(['/productos']);
};
