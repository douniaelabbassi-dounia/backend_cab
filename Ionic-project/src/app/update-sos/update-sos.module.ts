import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UpdateSosPageRoutingModule } from './update-sos-routing.module';
import { UpdateSosPage } from './update-sos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateSosPageRoutingModule
  ],
  declarations: [UpdateSosPage]
})
export class UpdateSosPageModule {}
