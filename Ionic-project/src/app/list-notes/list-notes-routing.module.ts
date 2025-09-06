import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListNotesPage } from './list-notes.page';

const routes: Routes = [
  {
    path: '',
    component: ListNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListNotesPageRoutingModule {}