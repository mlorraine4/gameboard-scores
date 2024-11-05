import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';
import { BoardgameService } from '../../../shared/services/boardgame.service';
import { Boardgame } from '../../../shared/models/boardgame.model';
import { ScoreService } from '../../../shared/services/score.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css',
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  savedBoardgames: Boardgame[] = [];
  favoriteBoardgames: Boardgame[] = [];
  highScores: any[] = [];

  constructor(
    private sessionService: SessionService,
    private boardgameService: BoardgameService,
    private scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    // Get list of user's game sessions
    this.sessionService.getUserSessions().subscribe((res) => {
      console.log(res);
      this.sessions = res.sessions;
    });

    // Get list of user's saved and favorite boardgames
    this.boardgameService.getUserBoardgames().subscribe((res) => {
      this.savedBoardgames = res.boardgames;
      this.favoriteBoardgames = res.favorite_boardgames;
      this.getHighScores();
    });
  }

  // Get high scores for each saved boardgame
  getHighScores() {
    for (const game of this.savedBoardgames) {
      this.scoreService.getHighScoreByGame(game._id).subscribe((res) => {
        this.highScores.push(res.score);
      });
    }
  }
}
