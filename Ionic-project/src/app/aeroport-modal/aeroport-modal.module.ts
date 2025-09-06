import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeroportModalPageRoutingModule } from './aeroport-modal-routing.module';

import { AeroportModalPage } from './aeroport-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeroportModalPageRoutingModule
  ],
  declarations: [AeroportModalPage]
})
export class AeroportModalPageModule {}
