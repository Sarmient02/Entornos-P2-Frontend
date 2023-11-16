import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { LoginRTA } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private authState = new BehaviorSubject<User | null>(null);
  authState$ = this.authState.asObservable();

  login(username: string, password: string) {
    const options = {
      withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
    };
    const url = `${this.API_URL}/auth/signin`;
    return this.http.post<LoginRTA>(url, {username, password}, options)
    .pipe(
      tap(response => this.tokenService.saveToken(response.accessToken)),
      tap(response => this.tokenService.saveRefreshToken(response.refreshToken)),
      tap(response => this.authState.next(response))
    )
  }

  setAuthState(user: User | null) {
    this.authState.next(user);
  }

  logout() {
    this.tokenService.clearToken();
    return this.http.post(this.API_URL + '/auth/signout', { }, { withCredentials: true });
  }

  refreshToken() {
    const options = {
      withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
    };
    return this.http.post(this.API_URL + '/auth/refreshtoken', { }, options);
  }
}
