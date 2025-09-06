import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumConfirmationPageRoutingModule } from './premium-confirmation-routing.module';

import { PremiumConfirmationPage } from './premium-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumConfirmationPageRoutingModule
  ],
  declarations: [PremiumConfirmationPage]
})
export class PremiumConfirmationPageModule {}
