import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateSosPage } from './update-sos.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateSosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateSosPageRoutingModule {}
