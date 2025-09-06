import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashScreenPageRoutingModule } from './splash-screen-routing.module';

import { SplashScreenPage } from './splash-screen.page';
import { MapComponent } from '../utiles/component/map/map.component';
import { ShareModule } from '../utiles/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashScreenPageRoutingModule,
    ShareModule
  ],
  declarations: [SplashScreenPage,
    MapComponent
  ]
})
export class SplashScreenPageModule {}
