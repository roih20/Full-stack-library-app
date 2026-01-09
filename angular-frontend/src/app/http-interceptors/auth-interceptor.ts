import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/auth-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AUTH_ENABLED = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(AUTH_ENABLED)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const route = inject(Router);

  const token = authService.getToken();

  if (!token || !authService.isLoggedIn) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => error);
      }),
    );
  }

  const newRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(newRequest);
};
