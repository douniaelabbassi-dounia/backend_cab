import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GPSAccessPage } from './gpsaccess.page';

const routes: Routes = [
  {
    path: '',
    component: GPSAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GPSAccessPageRoutingModule {}
