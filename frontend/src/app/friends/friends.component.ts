import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { AsyncPipe, NgFor } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [AsyncPipe, NgFor],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
  providers: [],
})
export class FriendsComponent implements OnInit {
  friends: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.friends().subscribe((res) => {
      this.friends = res.friends;
    });
  }

  removeFriend(username: string) {
    this.userService.removeFriend(username).subscribe((res) => {
      console.log(res);
      if (res.ok) {
        const isUser = (user: User) => user.username === username;
        let index = this.friends.findIndex(isUser);
        if (index > -1) {
          this.friends.splice(index, 1);
        }
      }
      // TODO: display error
    });
  }
}
