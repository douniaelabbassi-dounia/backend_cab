import { Component, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { presentToast } from '../utiles/component/notification';

@Component({
  selector: 'app-aeroport-modal',
  templateUrl: './aeroport-modal.page.html',
  styleUrls: ['./aeroport-modal.page.scss'],
})
export class AeroportModalPage {
  @Input() aeroport: any;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  async saveChanges() {
    const loading = await this.loadingCtrl.create({ message: 'Sauvegarde...' });
    await loading.present();

    // The ngModel has already updated the `this.aeroport` object
    this.apiService.updateAirport(this.aeroport.id, this.aeroport).subscribe({
      next: (updatedAirport) => {
        loading.dismiss();
        presentToast('Modifications enregistrées avec succès', 'bottom', 'success');
        this.modalController.dismiss(updatedAirport, 'confirm');
      },
      error: (err) => {
        loading.dismiss();
        presentToast('Erreur lors de la sauvegarde', 'bottom', 'danger');
        console.error('Error updating airport', err);
      }
    });
  }
}
