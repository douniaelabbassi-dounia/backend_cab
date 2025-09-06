import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateEvenementPage } from './update-evenement.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateEvenementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateEvenementPageRoutingModule {}
