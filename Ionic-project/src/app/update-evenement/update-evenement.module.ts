import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateEvenementPageRoutingModule } from './update-evenement-routing.module';

import { UpdateEvenementPage } from './update-evenement.page';
import { ShareModule } from '../utiles/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateEvenementPageRoutingModule,
    ShareModule,

  ],
  declarations: [UpdateEvenementPage]
})
export class UpdateEvenementPageModule {}
