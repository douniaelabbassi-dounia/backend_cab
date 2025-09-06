import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GPSAccessPageRoutingModule } from './gpsaccess-routing.module';

import { GPSAccessPage } from './gpsaccess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GPSAccessPageRoutingModule
  ],
  declarations: [GPSAccessPage]
})
export class GPSAccessPageModule {}
