import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListNotesPageRoutingModule } from './list-notes-routing.module';

import { ListNotesPage } from './list-notes.page';
import { ShareModule } from '../utiles/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListNotesPageRoutingModule,
    ShareModule
  ],
  declarations: [ListNotesPage]
})
export class ListNotesPageModule {}