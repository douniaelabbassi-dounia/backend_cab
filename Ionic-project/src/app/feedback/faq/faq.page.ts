import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  listFaq:Array<{
    title:string,message:string}> = [
    {
      title:"Qu'est-ce que cette application ?",
      message:"Cette application permet aux utilisateurs de partager des informations géolocalisées entre eux, avec des fonctionnalités avancées et un système d'abonnement payant.      "
    },
    {
      title:"Qui peut utiliser cette application ?",
      message:"Cette application permet aux utilisateurs de partager des informations géolocalisées entre eux, avec des fonctionnalités avancées et un système d'abonnement payant.      "
    },
    {
      title:"L'application est-elle gratuite ?",
      message:"Cette application permet aux utilisateurs de partager des informations géolocalisées entre eux, avec des fonctionnalités avancées et un système d'abonnement payant.      "
    },
    {
      title:"Quelles sont les fonctionnalités avancées avec l'abonnement payant ?",
      message:"Cette application permet aux utilisateurs de partager des informations géolocalisées entre eux, avec des fonctionnalités avancées et un système d'abonnement payant.      "
    },
    {
      title:"Combien coûte l'abonnement payant ?",
      message:"Cette application permet aux utilisateurs de partager des informations géolocalisées entre eux, avec des fonctionnalités avancées et un système d'abonnement payant.      "
    }
  ]

  constructor(private router:Router) { }

  ngOnInit() {
  }

  accordion(){
    
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
