import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN_URL, SIGN_UP_URL } from '../constants/urls';
import { AuthModel } from '../models/auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;

  getToken() {
    return this.token;
  }

  getAuthenticatedSub() {
    return this.authenticatedSub.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  constructor(private http: HttpClient, private router: Router) {}

  signUpUser(username: string, password: string) {
    const data: AuthModel = { username: username, password: password };

    this.http.post(SIGN_UP_URL, data).subscribe((res) => {
      console.log(res);
    });
  }

  loginUser(username: string, password: string) {
    const data: AuthModel = { username: username, password: password };

    this.http.post<{ token: string }>(LOGIN_URL, data).subscribe((res) => {
      console.log(res);
      this.token = res.token;
      if (this.token) {
        this.authenticatedSub.next(true);
        this.isAuthenticated = true;
        this.storeToken(this.token);
        this.router.navigate(['/friends']);
      }
    });
  }

  logOutUser() {
    this.token = '';
    this.authenticatedSub.next(false);
    this.isAuthenticated = false;
    this.removeToken();
    this.router.navigate(['/login']);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getLocalStorage() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    return token;
  }

  authenticateFromLocalStorage() {
    const token = this.getLocalStorage();
    // TODO: write function to clear token on expiration

    if (token) {
      this.token = token;
      this.isAuthenticated = true;
      this.authenticatedSub.next(true);
    }
  }
}
