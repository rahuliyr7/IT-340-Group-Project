import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }

  verifyTwoFactor(userId: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-2fa`, { userId, code });
  }
}
