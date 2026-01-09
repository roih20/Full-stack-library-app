import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DecodeToken, LoginResponse } from '@app/types/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/auth';
  name = signal<string | undefined>('');
  sub = signal<string | undefined>('');
  role = signal<string | undefined>('');
  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.checkAuthentication();
  }

  signup(userInput: any) {
    return this.http.post(`${this.API_URL}/signup`, userInput);
  }

  login(userInput: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, userInput);
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.checkAuthentication();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.checkAuthentication();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  private checkAuthentication(): void {
    // Check if user is authenticated
    if (this.isAuthenticated()) {
      this.sub.set(this.getSubject());
      this.name.set(this.getName());
      this.role.set(this.getRole());
      this.isLoggedIn.set(true);
    } else {
      this.sub.set(undefined);
      this.name.set(undefined);
      this.role.set(undefined);
      this.isLoggedIn.set(false);
    }
  }

  private isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token || this.isTokenExpired()) {
      return false;
    }

    return true;
  }

  private decodeToken(): DecodeToken | null {
    try {
      const token = this.getToken();

      if (!token) {
        return null;
      }

      return jwtDecode<DecodeToken>(token);
    } catch (error) {
      console.error('Error decoding token: ', error);
      return null;
    }
  }

  private getRole(): string | undefined {
    return this.decodeToken()?.roles?.[0];
  }

  private getName(): string | undefined {
    return this.decodeToken()?.name;
  }

  private getSubject(): string | undefined {
    return this.decodeToken()?.sub;
  }

  private getTokenExpiration(): number | undefined {
    return this.decodeToken()?.exp;
  }

  private isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();

    if (!exp) {
      return true;
    }

    return exp * 1000 < Date.now();
  }
}
