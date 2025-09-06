import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateProfilPage } from './update-profil.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateProfilPageRoutingModule {}
