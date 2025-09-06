import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AeroportPage } from './aeroport.page';

const routes: Routes = [
  {
    path: '',
    component: AeroportPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroportPageRoutingModule {}
