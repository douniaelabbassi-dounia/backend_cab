import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PubPage } from './pub.page';

const routes: Routes = [
  {
    path: '',
    component: PubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PubPageRoutingModule {}
