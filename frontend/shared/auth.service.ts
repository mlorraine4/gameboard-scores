import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN, SIGN_UP } from './constants/urls';
import { AuthModel } from './models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUpUser(username: string, password: string) {
    const data: AuthModel = { username: username, password: password };

    this.http.post(SIGN_UP, data).subscribe((res) => {
      console.log(res);
    });
  }

  loginUser(username: string, password: string) {
    const data: AuthModel = { username: username, password: password };

    this.http.post(LOGIN, data).subscribe((res) => {
      console.log(res);
    });
  }
}
