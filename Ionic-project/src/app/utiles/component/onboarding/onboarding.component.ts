import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent  implements OnInit {
  @Output() displayer = new EventEmitter();
  nextbord:string = '0';
  
  constructor() { }

  ngOnInit() {}

  close(){
    this.displayer.emit();
  }

  next(number:string) {
    switch (number) {
      case '0':
        this.nextbord = number;
        break;
      case '1':
        this.nextbord = number;
        break;
      case '2':
        this.nextbord = number;
        break;
      case '3':
        localStorage.setItem('onpoarding', '1');
        this.close();
        break;
    
      default:
        break;
    }
  }

}
