import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {

  constructor(private router:Router) { }

  selectedPack:string = '1'

  ngOnInit() {
  }

  goMap() {
    this.router.navigate(["/map"])
  }

  continue(){
    this.router.navigate(['/premium-confirmation'])
  }

  selectPack(choice:string){
    this.selectedPack = choice;
  }

}
