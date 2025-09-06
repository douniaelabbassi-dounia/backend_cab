import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-warning-update-proffessional-info',
  templateUrl: './warning-update-proffessional-info.component.html',
  styleUrls: ['./warning-update-proffessional-info.component.scss'],
})
export class WarningUpdateProffessionalInfoComponent  implements OnInit {
  @Output() closeConfirmation = new EventEmitter();
  @Output() updatingInfo = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  close(){
    this.closeConfirmation.emit();
  }

  updatingInfoMethod(){
    this.updatingInfo.emit();
  }
}
