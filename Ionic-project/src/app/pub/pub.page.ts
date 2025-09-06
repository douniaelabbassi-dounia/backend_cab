import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pub',
  templateUrl: './pub.page.html',
  styleUrls: ['./pub.page.scss'],
})
export class PubPage implements OnInit {
  displayer = {
    autreDisplay:false
  }

  conteurPub:number = 5;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
    const interval = setInterval(()=>{
        this.conteurPub--;
        console.log(this.conteurPub)
        if(this.conteurPub == 0){
          clearInterval(interval)
        }
      }, 1000)
  }

  redirectPub(){
    this.router.navigate(["/onboarding"])
  }

}
