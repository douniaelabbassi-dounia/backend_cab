import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { presentToast } from '../../notification';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent  implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Output() closeDateTime = new EventEmitter();
  @Input() multiDate = false;
  date:string[] | string = ''
  minDate:string = "";

  currentYear(){
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.date = `${year}-${month}-${day}`;
    this.minDate = `${year}-01-01`; // Set min date to the start of the current year
  }
  constructor() { }

  ngOnInit() {
    this.currentYear();
  }

  close() {  
    this.closeDateTime.emit(this.date);
  }

  updateValue(){
    if(typeof this.date == "object"){
      console.log(this.date);
      this.valueChange.emit(this.date);
      this.close()
    }else {
      console.log(this.date);
      this.date = [this.date];
      console.log(this.date);
      this.valueChange.emit(this.date);
      this.close()

    }
  }

}
