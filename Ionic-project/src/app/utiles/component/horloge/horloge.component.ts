import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-horloge',
  templateUrl: './horloge.component.html',
  styleUrls: ['./horloge.component.scss'],
})
export class HorlogeComponent  implements OnInit {
  @Input() horlogeDisplay:any;
  @Output() closeHorloge= new EventEmitter();

  timeValue:{hour:string, min:string} = {
    hour:'07', 
    min:'00'
  }
  displayTimeBegin:boolean = false

  constructor() { }

  ngOnInit() {}

  close(){
    this.closeHorloge.emit();
  }

  toggaleModal() {
    this.displayTimeBegin = !this.displayTimeBegin;
  }

  formaTime(getvalue:string)  {
    const date = new Date(getvalue);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return {hour:hours,min: minutes}  
  }

  setValue(newValue: string){
    this.timeValue = this.formaTime(newValue)
    console.log('( heureDebut ) outside of the component : ' + this.timeValue.hour + ":"+this.timeValue.min);
  }

}