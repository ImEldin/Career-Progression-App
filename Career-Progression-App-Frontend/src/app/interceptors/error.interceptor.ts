// src/app/interceptors/error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';
      console.log('Error:', error);

      let parsedError = error.error;
      if (typeof error.error === 'string') {
        try {
          parsedError = JSON.parse(error.error);
        } catch (e) {
          console.warn('Could not parse error.error as JSON:', error.error);
        }
      }

      if (parsedError?.message) {
        message = parsedError.message;
      } else if (error.status === 0) {
        message = 'Cannot connect to the server.';
      }

      snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
