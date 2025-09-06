import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  nextbord:string = '0';

  constructor(private router:Router) { }

  ngOnInit() {
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
        this.router.navigate(["/map"]);
        break;
    
      default:
        break;
    }
  }
}
