import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeroportModalPage } from './aeroport-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AeroportModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroportModalPageRoutingModule {}
