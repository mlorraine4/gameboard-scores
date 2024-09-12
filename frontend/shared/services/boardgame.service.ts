import { HttpClient } from '@angular/common/http';
import { BOARDGAME_BY_ID_URL, BOARDGAME_SEARCH_URL } from '../constants/urls';
import { Observable } from 'rxjs';
import { Boardgame } from '../models/boardgame.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BoardgameService {
  constructor(private http: HttpClient) {}

  searchBoardgames(search: string): Observable<{ boardgames: Boardgame[] }> {
    return this.http.get<{ boardgames: Boardgame[] }>(
      BOARDGAME_SEARCH_URL + search
    );
  }

  searchBoardgameById(id: string): Observable<{ boardgame: Boardgame }> {
    return this.http.get<{ boardgame: Boardgame }>(
      BOARDGAME_BY_ID_URL + '/' + id,
      {}
    );
  }
}
