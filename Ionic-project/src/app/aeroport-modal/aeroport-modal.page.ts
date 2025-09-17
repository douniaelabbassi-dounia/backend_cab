import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { presentToast } from '../utiles/component/notification';

@Component({
  selector: 'app-aeroport-modal',
  templateUrl: './aeroport-modal.page.html',
  styleUrls: ['./aeroport-modal.page.scss'],
})
export class AeroportModalPage implements OnInit {
  @Input() aeroport: any;

  // Properties to safely bind hours and minutes for the 'attenteBAT' field
  attenteHours: any = '';
  attenteMinutes: any = '';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.parseAttenteBat();
  }

  /**
   * Parses the "Xh Y" string from the API into separate, editable properties.
   */
  private parseAttenteBat(): void {
    if (this.aeroport && typeof this.aeroport.attenteBAT === 'string') {
      const parts = this.aeroport.attenteBAT.split(' ');
      this.attenteHours = parts[0] ? parseInt(parts[0].replace('h', ''), 10) || '' : '';
      this.attenteMinutes = parts.length > 1 && parts[1] ? parseInt(parts[1], 10) || '' : '';
    }
  }

  /**
   * Reconstructs the "Xh Y" string from the component properties before saving.
   */
  private reconstructAttenteBat(): void {
    this.aeroport.attenteBAT = `${Number(this.attenteHours) || 0}h ${Number(this.attenteMinutes) || 0}`;
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  async saveChanges() {
    const loading = await this.loadingCtrl.create({ message: 'Sauvegarde...' });
    await loading.present();

    // Reconstruct the attenteBAT string from the input fields before sending
    this.reconstructAttenteBat();

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
