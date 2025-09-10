import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gps-permission',
  templateUrl: './gps-permission.component.html',
  styleUrls: ['./gps-permission.component.scss']
})
export class GPSPermissionComponent {
  constructor(private modalCtrl: ModalController) {}

  enableGps() {
    this.modalCtrl.dismiss(null, 'enable');
  }

  notNow() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}

