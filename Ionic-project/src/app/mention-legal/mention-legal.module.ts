import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MentionLegalPageRoutingModule } from './mention-legal-routing.module';

import { MentionLegalPage } from './mention-legal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MentionLegalPageRoutingModule
  ],
  declarations: [MentionLegalPage]
})
export class MentionLegalPageModule {}
