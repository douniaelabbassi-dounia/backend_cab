import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionAmisPage } from './gestion-amis.page';

const routes: Routes = [
  {
    path: '',
    component: GestionAmisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionAmisPageRoutingModule {}
