import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AeroportIframModalComponent } from './aeroport-ifram-modal.component';



const routes: Routes = [
  {
    path: '',
    component: AeroportIframModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeroportIframRouteModule { }
