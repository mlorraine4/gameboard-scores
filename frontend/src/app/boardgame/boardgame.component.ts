import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardgameService } from '../../../shared/services/boardgame.service';
import { Boardgame } from '../../../shared/models/boardgame.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-boardgame',
  standalone: true,
  imports: [],
  templateUrl: './boardgame.component.html',
  styleUrl: './boardgame.component.css',
})
export class BoardgameComponent {
  id!: string;
  boardgame!: Boardgame;
  userBoardgames!: Boardgame[];

  constructor(
    private route: ActivatedRoute,
    private boardgameService: BoardgameService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;

      // Get boardgame data from boardgamegeek's api
      this.boardgameService.searchBoardgameById(this.id).subscribe((res) => {
        this.boardgame = res.boardgame;
      });

      // Get user data
      this.userService.boardgames().subscribe((res) => {
        console.log(res.boardgames);
        this.userBoardgames = res.boardgames;
      });
    }
  }

  isSaved(id: string) {
    return this.userBoardgames.some(function (el: Boardgame) {
      return el.bgg_id === id;
    });
  }

  addBoardgame(e: any, id: string) {
    this.userService.addBoardgame(id).subscribe((res) => {
      console.log(res);
      if (res.ok) {
        e.target.disabled = true;
        e.target.innerHTML = 'Added to Games';
      }
    });
  }
}
