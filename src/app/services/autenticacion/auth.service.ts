import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { AuthResponse } from '../../models/dto/authResponse.model';
import { DecodedToken } from '../../models/dto/DecodedToken.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/api/authentication/login';
  private tokenKey = 'token';
  private currentUserSubject: BehaviorSubject<DecodedToken | null>;
  public currentUser$: Observable<DecodedToken | null>;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.tokenKey);
    const decodedToken = token ? this.decodeToken(token) : null;

    this.currentUserSubject = new BehaviorSubject<DecodedToken | null>(decodedToken);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, contrasena }).pipe(
      tap((response: AuthResponse) => {
        if (response.status) {
          localStorage.setItem(this.tokenKey, response.token);
          const decodedToken = this.decodeToken(response.token);
          this.currentUserSubject.next(decodedToken);
        } else {
          console.error(response.message);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decodedToken = this.decodeToken(token);
    if (decodedToken && this.isTokenExpired(decodedToken.exp)) {
      this.logout();
      return false;
    }

    return !!decodedToken;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  private isTokenExpired(exp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  get usuarioActual(): DecodedToken | null {
    return this.currentUserSubject.value;
  }
}
