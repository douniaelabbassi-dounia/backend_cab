import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeroportDetailsPage } from './aeroport-details.page';

const routes: Routes = [
  {
    path: '',
    component: AeroportDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroportDetailsPageRoutingModule {}
