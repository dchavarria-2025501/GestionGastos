import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.model';

const API_URL = 'http://localhost:3000/api/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  listUsers(): Observable<{ users: Usuario[] }> {
    return this.http.get<{ users: Usuario[] }>(API_URL);
  }

  updateUser(id: string, cambios: Partial<Usuario>): Observable<{ user: Usuario }> {
    return this.http.put<{ user: Usuario }>(`${API_URL}/${id}`, cambios);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
