import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SosPage } from './sos.page';

const routes: Routes = [
  {
    path: '',
    component: SosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SosPageRoutingModule {}
