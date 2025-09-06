import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThanksPagePage } from './thanks-page.page';

const routes: Routes = [
  {
    path: '',
    component: ThanksPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThanksPagePageRoutingModule {}
