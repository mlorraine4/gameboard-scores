import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Boardgame } from '../../../shared/models/boardgame.model';
import { BoardgameService } from '../../../shared/services/boardgame.service';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { ScoreService } from '../../../shared/services/score.service';
import { ErrorComponent } from '../shared/error/error.component';
import { ErrorHandlingService } from '../../../shared/services/errorHandling.service';
import { catchError } from 'rxjs';
import { SuccessComponent } from '../shared/success/success.component';
import { SuccessHandlingService } from '../../../shared/services/successHandling.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorComponent, SuccessComponent],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.css',
})
export class SessionFormComponent implements OnInit {
  form!: FormGroup;
  searchForm!: FormGroup;
  friendSearchForm!: FormGroup;
  boardgameSearchResults!: Boardgame[];
  friends!: User[];
  user!: User;
  userSearchResults!: User[];
  isAddMode: Boolean = false;
  id!: string;
  score!: {};

  constructor(
    private fb: FormBuilder,
    private boardgameService: BoardgameService,
    private userService: UserService,
    private scoreService: ScoreService,
    private sessionService: SessionService,
    private errorHandlingService: ErrorHandlingService,
    private successHandlingService: SuccessHandlingService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      boardgameId: ['', Validators.required],
      players: this.fb.array([], Validators.minLength(1)),
    });
    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });
    this.friendSearchForm = this.fb.group({
      friendSearch: ['', Validators.required],
    });
  }

  ngOnInit() {
    // TODO: change this to include extra paths (friends, notifications, etc) instead of calling multiple requests
    // Set mode to edit/add based on id param
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    console.log(this.isAddMode);

    if (!this.isAddMode) {
      // In edit mode, get score data from id
      this.scoreService.getScoreById(this.id).subscribe((res) => {
        // TODO: pre populate form based on data
        console.log(res);
      });
    }

    // Get current user info
    this.userService.getCurrentUser().subscribe((res) => {
      if (res.user) {
        // this.user = res.user;
        this.addPlayer(res.user.username, res.user._id);
      }
    });
    // Get user's friends
    this.userService.getFriends().subscribe((res) => {
      this.friends = res.friends;
    });
  }

  get players() {
    return this.form.get('players') as FormArray;
  }

  // Add new player form for selected user
  addPlayer(username: string, id?: string, i?: number) {
    const players = this.form.controls['players'] as FormArray;
    players.push(
      this.fb.group({
        id: [id],
        username: [username, Validators.required],
        points: [''],
        won: [false],
      })
    );
    if (i !== undefined) {
      this.userSearchResults.splice(i, 1);
      this.friendSearchForm.reset();
    }
  }

  async saveSession() {
    // TODO: create model for body ({boardgameId: string, players: [id, points, username, won]})
    console.log(this.form.getRawValue());
    this.sessionService
      .addSession(this.form.getRawValue())
      .pipe(
        catchError(
          this.errorHandlingService.handleError(
            'An error occurred adding score'
          )
        )
      )
      .subscribe((res) => {
        this.successHandlingService.handleSuccess(
          'Score successfully submitted'
        );
        this.form.reset();
        this.boardgameSearchResults = [];
        this.userSearchResults = [];
      });
  }

  searchBoardgames() {
    this.boardgameService
      .searchBoardgames(this.searchForm.controls['search'].value)
      .subscribe((res) => {
        this.boardgameSearchResults = res.boardgames;
        this.searchForm.reset();
      });
  }

  searchFriends() {
    // TODO: change to search of all users?
    const search = this.friendSearchForm.controls['friendSearch'].value;
    let results = [];

    for (const friend of this.friends) {
      if (friend.username.includes(search.toLowerCase())) {
        results.push(friend);
        console.log(friend);
      }
    }
    this.userSearchResults = results;
  }

  removePlayer(i: number) {
    const players = this.form.controls['players'] as FormArray;
    players.removeAt(i);
  }
}
