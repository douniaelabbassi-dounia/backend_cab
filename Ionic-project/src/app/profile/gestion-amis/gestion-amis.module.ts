import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionAmisPageRoutingModule } from './gestion-amis-routing.module';

import { GestionAmisPage } from './gestion-amis.page';
import { ShareModule } from 'src/app/utiles/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionAmisPageRoutingModule,
    ShareModule
  ],
  declarations: [GestionAmisPage]
})
export class GestionAmisPageModule {}
