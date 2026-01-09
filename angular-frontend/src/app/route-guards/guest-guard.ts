import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '@auth/auth-service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const homePath = router.parseUrl('/');
    return new RedirectCommand(homePath, { replaceUrl: true });
  }

  return true;
};
