import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
selector: 'app-sos',
templateUrl: './sos.page.html',
styleUrls: ['./sos.page.scss'],
})
export class SosPage {
constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss(); // Ferme le modal
  }
}
