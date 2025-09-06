import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AeroportIframModalComponent } from './aeroport-ifram-modal.component';
import { IonicModule } from '@ionic/angular';
import { AeroportIframRouteModule } from './aeroport-ifram-route.module';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AeroportIframModalComponent , 
  },
];

@NgModule({
  declarations: [AeroportIframModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    AeroportIframRouteModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
  ],
  exports: [AeroportIframModalComponent]

})
export class AeroportIframModule { }
