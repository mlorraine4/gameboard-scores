import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN_URL, SIGN_UP_URL } from '../constants/urls';
import { Auth } from '../models/auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private authenticatedSub = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthenticatedSub() {
    return this.authenticatedSub.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  signUpUser(username: string, password: string) {
    const data: Auth = { username: username, password: password };

    this.http.post(SIGN_UP_URL, data).subscribe((res) => {
      console.log(res);
    });
  }

  loginUser(username: string, password: string) {
    const data: Auth = { username: username, password: password };

    this.http
      .post<{ token: string; expiresIn: number }>(LOGIN_URL, data)
      .subscribe((res) => {
        console.log(res);
        this.token = res.token;
        if (this.token) {
          this.authenticatedSub.next(true);
          this.isAuthenticated = true;
          const now = new Date();
          const expiresDate = new Date(now.getTime() + res.expiresIn * 1000);
          this.storeToken(this.token, expiresDate);
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

  storeToken(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toISOString());
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  getLocalStorage() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');

    if (!token || !expiresIn) {
      return;
    }

    return {
      token: token,
      expiresIn: new Date(expiresIn),
    };
  }

  authenticateFromLocalStorage() {
    const localStorageData = this.getLocalStorage();
    console.log('authenticating from local storage');
    if (localStorageData) {
      const now = new Date();
      const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

      if (expiresIn > 0) {
        this.token = localStorageData.token;
        this.isAuthenticated = true;
        this.authenticatedSub.next(true);
      } else {
        this.logOutUser();
      }
    }
  }
}
