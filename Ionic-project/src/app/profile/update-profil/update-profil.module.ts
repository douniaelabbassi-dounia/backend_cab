import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateProfilPageRoutingModule } from './update-profil-routing.module';

import { UpdateProfilPage } from './update-profil.page';
import { ShareModule } from 'src/app/utiles/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateProfilPageRoutingModule,
    ShareModule
    
  ],
  declarations: [UpdateProfilPage]
})
export class UpdateProfilPageModule {}
