import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendFormComponent } from './friend-form.component';

describe('FriendFormComponent', () => {
  let component: FriendFormComponent;
  let fixture: ComponentFixture<FriendFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
