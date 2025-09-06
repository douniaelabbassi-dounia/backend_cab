import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AidePage } from './aide.page';

const routes: Routes = [
  {
    path: '',
    component: AidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AidePageRoutingModule {}
