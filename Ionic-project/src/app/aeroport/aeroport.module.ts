import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SafeUrlPipe } from './safe-url.pipe';
import { AeroportPageRoutingModule } from './aeroport-routing.module';
import { AeroportPage } from './aeroport.page';



@NgModule({
  declarations: [AeroportPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeroportPageRoutingModule
  ]
  
})
export class AeroportPageModule {}
