import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListEvenementPageRoutingModule } from './list-evenement-routing.module';
import { ListEvenementPage } from './list-evenement.page';
import { ShareModule } from '../utiles/share/share.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListEvenementPageRoutingModule,
    ShareModule
  ],
  declarations: [ListEvenementPage]
})
export class ListEvenementPageModule {}