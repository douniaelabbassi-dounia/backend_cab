import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvisPageRoutingModule } from './avis-routing.module';

import { AvisPage } from './avis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvisPageRoutingModule
  ],
  declarations: [AvisPage]
})
export class AvisPageModule {}
