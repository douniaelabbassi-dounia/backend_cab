import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MentionLegalPage } from './mention-legal.page';

const routes: Routes = [
  {
    path: '',
    component: MentionLegalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentionLegalPageRoutingModule {}
