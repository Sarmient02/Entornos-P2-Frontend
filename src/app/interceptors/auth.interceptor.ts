import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


import { TokenService } from '../services/token.service';
import { StorageService } from '../services/storage.service';
import { EventData } from '../services/event.class';
import { AuthService } from '../services/auth.service';
import { EventBusService } from '../services/event-bus.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;

    constructor(
        private tokenService: TokenService,
        private storageService: StorageService,
        private eventBusService: EventBusService,
        private authService: AuthService
      ) {}
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        request = this.addToken(request);
        return next.handle(request).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401 &&
                    !request.url.includes('auth/signin')
                ) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);
            })
        );
    }

    private addToken(request: HttpRequest<unknown>) {
    const token = this.tokenService.getToken();
    if (token) {
        const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return authReq;
    }
    return request;
    }
      
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
        this.isRefreshing = true;

        if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
            switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
            }),
            catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
                this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
            })
        );
        }
    }

    return next.handle(request);
    }
}
