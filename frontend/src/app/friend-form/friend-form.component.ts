import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../../shared/services/friends.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-friend-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './friend-form.component.html',
  styleUrl: './friend-form.component.css',
})
export class FriendFormComponent implements OnInit {
  constructor(private friendService: FriendService) {}
  userSearchControl!: FormControl;

  ngOnInit(): void {
    this.userSearchControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]);
  }

  submitSearch() {
    this.friendService.searchUsers(this.userSearchControl.value);
  }
}
