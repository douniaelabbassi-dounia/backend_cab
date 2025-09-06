/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-aeroport-details',
  templateUrl: './aeroport-details.page.html',
  styleUrls: ['./aeroport-details.page.scss'],
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    
  ],
})
export class AeroportDetailsPage implements OnInit {
  aeroport: any;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    const data = this.route.snapshot.paramMap.get('data');
    if (data) {
      this.aeroport = JSON.parse(data);
    }
    this.route.queryParams.subscribe((params) => {
      if (params['aeroport']) {
        this.aeroport = JSON.parse(params['aeroport']);
      }
    });
  }
  
}
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AeroportDetailsPage } from './aeroport-details.page';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';

const routes: Routes = [
  {
    path: '',
    component: AeroportDetailsPage, 
  },
];

@NgModule({
  declarations: [AeroportDetailsPage], 
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
  ],
  exports: [RouterModule], 
})
export class AeroportDetailsModule {}



