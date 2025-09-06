import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumConfirmationPage } from './premium-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: PremiumConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumConfirmationPageRoutingModule {}
