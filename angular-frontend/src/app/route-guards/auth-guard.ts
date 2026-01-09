import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '@auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    const loginPath = router.parseUrl('/login');
    return new RedirectCommand(loginPath, { replaceUrl: true });
  }

  return true;
};
