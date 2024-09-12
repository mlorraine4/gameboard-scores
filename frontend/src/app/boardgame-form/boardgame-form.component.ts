import { Component, OnInit } from '@angular/core';
import { Boardgame } from '../../../shared/models/boardgame.model';
import { BoardgameService } from '../../../shared/services/boardgame.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BOARDGAME_URL } from '../../../shared/constants/urls';

@Component({
  selector: 'app-boardgame-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './boardgame-form.component.html',
  styleUrl: './boardgame-form.component.css',
})
export class BoardgameFormComponent implements OnInit {
  boardgameSearchControl!: FormControl;
  boardgames: Boardgame[] = [];

  constructor(private boardgameService: BoardgameService) {}

  ngOnInit(): void {
    this.boardgameSearchControl = new FormControl('', [Validators.required]);
  }

  boardgameUrl(id: string) {
    return BOARDGAME_URL + '/' + id;
  }

  // TODO: unscaping search results with custom pipe
  submitSearch() {
    this.boardgameService
      .searchBoardgames(this.boardgameSearchControl.value)
      .subscribe((res) => {
        console.log(res);
        this.boardgames = res.boardgames;
      });
  }
}
