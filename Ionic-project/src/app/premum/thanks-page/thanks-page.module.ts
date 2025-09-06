import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThanksPagePageRoutingModule } from './thanks-page-routing.module';

import { ThanksPagePage } from './thanks-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThanksPagePageRoutingModule
  ],
  declarations: [ThanksPagePage]
})
export class ThanksPagePageModule {}
