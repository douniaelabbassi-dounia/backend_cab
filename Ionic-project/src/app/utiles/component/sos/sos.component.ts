import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.component.html',
  styleUrls: ['./sos.component.scss'],
})
export class SosComponent  implements OnInit {

  @Input() editMode: any; //values to edit of sos point
  @Input() sosDisplay:any;
  @Output() closeSos =new EventEmitter()
  @Output() validateSos  = new EventEmitter<any>();

  constructor() { }

  msg:string ='';
  numeroTel:string ='';

  ngOnInit() {
    if (this.editMode) {
      this.msg = this.editMode.msg || '';
      this.numeroTel = this.editMode.numeroTel || '';
    }
  }

  close() {
    this.closeSos.emit(); // Emit closeSos event
  }

  validate() {
    const SosData={
      msg:this.msg,
      numeroTel:this.numeroTel,
    }

    this.validateSos.emit(SosData);
    this.closeSos.emit();
  }

}
