import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { MenuComponent } from '../utiles/component/menu/menu.component';
import { HorlogeComponent } from '../utiles/component/horloge/horloge.component';
import { AffluenceComponent } from '../utiles/component/affluence/affluence.component';

import { EvenementsComponent } from '../utiles/component/evenements/evenements.component';
import { StatusComponent } from '../utiles/component/status/status.component';
import { NoteComponent } from '../utiles/component/note/note.component';
import { ListPointsComponent } from '../utiles/component/list-points/list-points.component';
import { AddressInputComponent } from '../utiles/component/address-input/address-input.component';
import { ShareModule } from '../utiles/share/share.module';
import { OnboardingComponent } from '../utiles/component/onboarding/onboarding.component';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { IonicGestureConfig } from '../utiles/IonicGestureConfig';
import { SosComponent } from '../utiles/component/sos/sos.component';
import { MenuModule } from '../utiles/component/menu/menu.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    ShareModule,
    MenuModule
  ],
  declarations: [
    MapPage,
    HorlogeComponent,
    AffluenceComponent,
    EvenementsComponent,
    StatusComponent,
    NoteComponent,
    ListPointsComponent,
    AddressInputComponent,
    OnboardingComponent,
    SosComponent

  ],
  providers:[{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[]
})
export class MapPageModule {}
