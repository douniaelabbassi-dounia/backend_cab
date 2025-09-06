import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mention-legal',
  templateUrl: './mention-legal.page.html',
  styleUrls: ['./mention-legal.page.scss'],
})
export class MentionLegalPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }


  goTo(destination: string){
    switch (destination) {
      case 'map':
        this.router.navigate(['/map']);
        break;

      case 'aide':
        this.router.navigate(['/aide']);
        break;

      default:
        break;
    }
  }

}
