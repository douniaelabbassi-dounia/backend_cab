import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import { MenuComponent } from './menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
