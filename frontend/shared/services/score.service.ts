import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ScoreService {
  constructor(private http: HttpClient) {}

  getAllScores() {}

  getScore() {}

  getBoardGame() {}

  saveScoresToLocalStorage() {}

  updateScoresOnLocalStorage() {}
}
