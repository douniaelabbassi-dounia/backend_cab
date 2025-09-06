import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonBackButton, IonButtons, IonTitle, IonContent } from "@ionic/angular/standalone";

@Component({    
  selector: 'app-aeroport-details',
  templateUrl: './aeroport-details.page.html',
  styleUrls: ['./aeroport-details.page.scss'],

})
export class AeroportDetailsPage implements OnInit {
  aeroport: any;
  constructor(private route: ActivatedRoute,private modalController: ModalController) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['aeroport']) {
        this.aeroport = JSON.parse(params['aeroport']);
      }
    });
  }
  closeModal() {
    this.modalController.dismiss();
  }
  
}
