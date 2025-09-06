import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PubPageRoutingModule } from './pub-routing.module';

import { PubPage } from './pub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PubPageRoutingModule
  ],
  declarations: [PubPage]
})
export class PubPageModule {}
