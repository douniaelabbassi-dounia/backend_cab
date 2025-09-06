import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium-confirmation',
  templateUrl: './premium-confirmation.page.html',
  styleUrls: ['./premium-confirmation.page.scss'],
})
export class PremiumConfirmationPage implements OnInit {
  
  constructor(private router:Router) { }

  ngOnInit() {
  }

  goTo(page:string){
    switch (page) {
      case 'back':
        this.router.navigate(['/premium'])
        break;
    
      case 'map':
        this.router.navigate(['/map'])
        break;

      case 'thanks':
        this.router.navigate(['/thanks-page'])
        break;
    
      default:
        break;
    }
  }

}
