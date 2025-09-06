import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import axios from 'axios';
import { presentToast } from '../notification';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
})
export class AddressInputComponent  implements OnInit {

  @Input() lieu:string = "";
  @Output() selectedAddress = new EventEmitter();
  @Input() focusInput:boolean = false;
  
  suggestions: any[] = [];
  private searchSubject: Subject<string> = new Subject<string>();
  isLocationValid: boolean = false;

  constructor() { }

  ngOnInit() {}

  onAddressChange() {
    this.searchSubject.next(this.lieu);
  }
  isLoading: boolean = false;

  async onAddressInput() {
    if (this.lieu.length > 3) {
      this.isLoading = true; // Activer la barre de chargement
      this.suggestions = []; // Réinitialiser les suggestions
      try {
        // France mainland bounds
        const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.lieu)}&format=json&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`
        );
        this.suggestions = response.data as Array<{ name: string, display_name: string, lat: string, lon: string }>;
        this.isLocationValid = Array.isArray(this.suggestions) && this.suggestions.length > 0;
        if (!Array.isArray(this.suggestions) || this.suggestions.length === 0) {
          presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
        }
      } catch (error: any) {
        console.error('Erreur lors de la récupération des suggestions d\'adresses :', error);
      } finally {
        this.isLoading = false; // Désactiver la barre de chargement
      }
    } else {
      this.suggestions = [];
      this.isLocationValid = false;
    }
  }
  

  

  onSelectAddress(selectedAddress: any) {
    console.log('Adresse sélectionnée :', selectedAddress);
    this.selectedAddress.emit(selectedAddress); // Émet l'adresse sélectionnée au parent
    this.lieu = selectedAddress.display_name; // Met à jour le champ d'entrée avec l'adresse sélectionnée
    this.suggestions = []; // Efface les suggestions après la sélection
    this.isLocationValid = true;
  }
  
}
