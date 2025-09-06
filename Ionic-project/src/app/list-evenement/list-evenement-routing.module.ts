import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEvenementPage } from './list-evenement.page';

const routes: Routes = [
  {
    path: '',
    component: ListEvenementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListEvenementPageRoutingModule {}
