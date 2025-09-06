import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent  implements OnInit {
  @Output() closeConfirmation = new EventEmitter();
  @Output() deleteFriend = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  close(){
    this.closeConfirmation.emit();
  }

  deleteFriendMethod(){
    this.deleteFriend.emit();
  }

}
