import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../../shared/services/friends.service';
import { User } from '../../../shared/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [AsyncPipe, NgFor],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
  providers: [FriendService],
})
export class FriendsComponent implements OnInit {
  friends: User[] = [];

  constructor(private friendService: FriendService) {}

  ngOnInit(): void {
    // this.friendService.getFriends().subscribe((friends) => {
    //   this.friends = friends;
    // });
  }
}
