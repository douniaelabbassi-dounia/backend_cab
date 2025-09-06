import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-source-modal',
  templateUrl: './image-source-modal.component.html',
  styleUrls: ['./image-source-modal.component.scss'],
})
export class ImageSourceModalComponent  implements OnInit {

  @Output() choice = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  constructor() { }

  ngOnInit() {}
  
  choiceMethod(value:string){
    this.choice.emit(value)
  }
  close(){
    this.closeModal.emit()
  }
}
