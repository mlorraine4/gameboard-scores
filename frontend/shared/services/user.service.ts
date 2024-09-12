import { HttpClient } from '@angular/common/http';
import {
  FRIENDS_URL,
  FRIEND_REQUESTS_LIST_URL,
  USER_BOARDGAME_URL,
  USER_SEARCH_URL,
  USER_URL,
} from '../constants/urls';
import { User } from '../models/user.model';
import { Boardgame } from '../models/boardgame.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  // TODO: add observable to all http req functions?
  currentUser!: User;

  getCurrentUser() {
    return this.currentUser;
  }

  storeCurrentUser() {
    this.http.get<{ user: User }>(USER_URL).subscribe((res) => {
      console.log(res.user);
      this.currentUser = res.user;
    });
  }

  removeFriend(username: string) {
    return this.http.delete(FRIENDS_URL + '/' + username, {
      responseType: 'text',
      observe: 'response',
    });
  }

  addFriend(username: string): Observable<any> {
    return this.http.put(FRIENDS_URL + '/' + username, null, {
      responseType: 'text',
      observe: 'response',
    });
  }

  searchUsers(username: string): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(USER_SEARCH_URL + username);
  }

  friends(): Observable<{ friends: User[]; friendIds: string[] }> {
    return this.http.get<{ friends: User[]; friendIds: string[] }>(FRIENDS_URL);
  }

  requests() {
    return this.http.get<User[]>(FRIEND_REQUESTS_LIST_URL);
  }

  boardgames() {
    return this.http.get<{
      boardgames: Boardgame[];
    }>(USER_BOARDGAME_URL);
  }

  addBoardgame(id: string) {
    return this.http.put(
      USER_BOARDGAME_URL,
      { id: id },
      {
        responseType: 'text',
        observe: 'response',
      }
    );
  }

  favoriteBoardgame() {}
}
