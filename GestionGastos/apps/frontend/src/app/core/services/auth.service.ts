import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, Usuario } from '../models/user.model';

const API_URL = 'http://localhost:3000/api/auth';
const TOKEN_KEY = 'gg_token';
const USER_KEY = 'gg_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal reactiva con el usuario actual (o null si no hay sesion)
  currentUser = signal<Usuario | null>(this.readUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  private readUserFromStorage(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }

  register(nombre: string, email: string, password: string): Observable<{ user: Usuario }> {
    return this.http.post<{ user: Usuario }>(`${API_URL}/register`, { nombre, email, password });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
}
