import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AidePageRoutingModule } from './aide-routing.module';

import { AidePage } from './aide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AidePageRoutingModule
  ],
  declarations: [AidePage]
})
export class AidePageModule {}
