import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('🚀 HTTP Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys().reduce((acc: any, key) => {
        acc[key] = req.headers.get(key);
        return acc;
      }, {}),
      body: req.body
    });

    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            console.log('✅ HTTP Response:', {
              status: event.status,
              url: event.url,
              body: event.body
            });
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            console.error('❌ HTTP Error:', {
              status: error.status,
              statusText: error.statusText,
              url: error.url,
              message: error.message,
              error: error.error
            });
          }
        }
      )
    );
  }
}