import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AeroportModalPage } from '../aeroport-modal/aeroport-modal.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-aeroport',
  templateUrl: './aeroport.page.html',
  styleUrls: ['./aeroport.page.scss'],
})
export class AeroportPage implements OnInit {
  aeroports: any = [];
  selectedAeroport: { name: string; url: SafeResourceUrl } | null = null;
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private apiService: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    // ngOnInit is fine for one-time setup, but data fetching that depends
    // on auth state is better in ionViewWillEnter.
  }

  async ionViewWillEnter() {
    // This hook runs every time the page is about to be viewed.
    await this.loadAirports();
  }

  async loadAirports() {
    this.loading = await this.loadingCtrl.create({ message: 'Chargement...' });
    await this.loading.present();
    
    this.apiService.getAirports().subscribe({
      next: (data) => {
        this.aeroports = data;
        this.loading?.dismiss();
      },
      error: (err) => {
        // If the page is blank, check the browser console for a 401/403 error. This indicates an authentication problem.
        console.error("Error fetching airports", err);
        this.loading?.dismiss();
      }
    });
  }

  // Navigation vers les détails
  // Renamed to match the function call in the HTML template `(click)="openDetailsNew(aeroport)"`.
  openDetailsNew(aeroport: any) {
    this.router.navigate(['/aeroport-details'], {
      queryParams: { aeroport: JSON.stringify(aeroport) },
    });
  }

  // Ouvrir la modal de modification
  async openModal(aeroport: any) {
    const modal = await this.modalController.create({
      component: AeroportModalPage,
      componentProps: { aeroport: { ...aeroport } }, // Pass a copy
    });
    
    modal.onDidDismiss().then((result) => {
      if (result.data && result.role === 'confirm') {
        const index = this.aeroports.findIndex(
          (a: any) => a.id === result.data.id
        );
        if (index !== -1) {
          this.aeroports[index] = result.data;
        }
      }
    });
    return modal.present();
  }
  
  goBack() {
    this.router.navigate(['/map']);
  }
}
