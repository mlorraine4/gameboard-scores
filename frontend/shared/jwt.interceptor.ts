import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = inject(AuthService).getToken();
  if (!token) {
    console.log('token not found');
    return next(req);
  }

  const authRequest = req.clone({
    headers: req.headers.set('authorization', token),
  });
  console.log('user authenticated with token');
  return next(authRequest);
}
