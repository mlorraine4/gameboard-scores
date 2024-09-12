import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../shared/models/user.model';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-friend-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './friend-form.component.html',
  styleUrl: './friend-form.component.css',
})
export class FriendFormComponent implements OnInit {
  userSearchControl!: FormControl;
  users!: User[];
  formSubmitted: boolean[] = [];
  friends!: string[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSearchControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]);

    this.userService.friends().subscribe((res) => {
      this.friends = res.friendIds;
    });
  }

  submitSearch() {
    this.userService
      .searchUsers(this.userSearchControl.value)
      .subscribe((res) => {
        console.log(res);
        this.users = res.users;
        this.formSubmitted.push(false);
      });
  }

  sendFriendRequest(user: User) {
    this.userService.addFriend(user.username).subscribe((res) => {
      if (res.ok) {
        let i = this.users.indexOf(user);
        this.formSubmitted[i] = true;
      }
    });
  }

  // Check if current user's friends array has searched user
  hasSentRequest(user: User) {
    return this.friends.some(function (el) {
      return el === user._id;
    });
  }

  // Check if searched user's friends array has current user
  hasRecievedRequest(user: User): Boolean {
    if (user.friends) {
      return user.friends.some((id) => {
        return id === this.userService.getCurrentUser()._id;
      });
    }
    return false;
  }

  // Check if user is friends with searched user
  isFriend(user: User) {
    if (this.hasSentRequest(user) && this.hasRecievedRequest(user)) {
      return true;
    }
    return false;
  }
}
