import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { presentToast } from '../../notification';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent  implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Output() closeDateTime = new EventEmitter();
  time:string = ""
 
  constructor() { }

  ngOnInit() {}

  close() {  
    setTimeout(() => {
      this.closeDateTime.emit();
    }, 100);
    
  }

  updateValue(newValue: string) {
    this.time = newValue;
    console.log(this.time);
  }

  submit(){
    if(this.time == ''){
      let date = new Date();
      let time = date.getTime()
      const date1 = new Date(time);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Format the date in the desired format
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      console.log(formattedDate);
      this.time = formattedDate
    }
      this.valueChange.emit(this.time);
      this.close()
    }

}
