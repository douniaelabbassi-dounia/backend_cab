import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { presentToast } from '../notification';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmationComponent  implements OnInit {

  @Input() content = "";
  @Input() selectedPointId:number|undefined;
  @Input() pointType: string = "";
  @Output() closeConfirmation = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  close(){
    this.closeConfirmation.emit();
  }

  deleteItemMethod() {
    if (this.selectedPointId != undefined && this.pointType!=null) {
      this.deleteItem.emit({ id: this.selectedPointId, type: this.pointType });
      this.close();

    } else {
      presentToast('Missing ID or point type!', 'bottom', 'danger');
    }
  }

}
