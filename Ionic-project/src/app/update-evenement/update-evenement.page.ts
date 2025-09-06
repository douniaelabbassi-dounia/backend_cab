import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';

@Component({
  selector: 'app-update-evenement',
  templateUrl: './update-evenement.page.html',
  styleUrls: ['./update-evenement.page.scss'],
})
export class UpdateEvenementPage implements OnInit {
  displayModal: any = {
    displayDate: false,
    displayTimeBegin: false,
    displayTimeEnd: false,
  };
  lieu: string = '';
  type: string = '';
  date: string = 'Non définie'; // Par défaut
  heureDebut: string = '00:00'; // Par défaut
  heureFin: string = '00:00'; // Par défaut

  suggestions: Array<any> = [];
  focusInput: boolean = false;
  isLocationValid: boolean = false;
  selectedposition: { name: string; display_name: string; lat: number; lon: number } = {
    name: '',
    display_name: '',
    lat: 0,
    lon: 0,
  };

  pointId: string | null = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pointsService: ListPointsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      this.pointId = param.get('id');
      console.log('Point ID :', this.pointId);
      this.getDetailPoint(this.pointId);
    });
  }

  getDetailPoint(id: string | null) {
    if (id != null) {
      const json = {
        pointId: id,
      };

      this.pointsService.$getPointDetails(json).subscribe((data: any) => {
        console.log('Données reçues depuis l\'API :', data);

        this.lieu = data.event.lieu || '';
        this.type = data.event.type || '';
        this.date = data.event.dates || 'Non définie';
        /*
          data.event.dateDebut && data.event.dateFin
            ? this.formatDateAndTime(data.event.dateDebut, 'date') +
              ' - ' +
              this.formatDateAndTime(data.event.dateFin, 'date')
            : 'Non définie'; // Définit si la date est manquante*/
        this.heureDebut = data.event.heureDebut || '00:00';
        this.heureFin = data.event.heureFin || '00:00';

        console.log('Date formatée :', this.date);
        console.log('Heure début :', this.heureDebut, 'Heure fin :', this.heureFin);
      });
    } else {
      console.log('ID nul : impossible de récupérer les détails.');
    }
  }

  toggaleModal(modal: string) {
    switch (modal) {
      case 'date':
        this.displayModal.displayDate = !this.displayModal.displayDate;
        break;
      case 'time-begin':
        this.displayModal.displayTimeBegin = !this.displayModal.displayTimeBegin;
        break;
      case 'time-end':
        this.displayModal.displayTimeEnd = !this.displayModal.displayTimeEnd;
        break;
      default:
        break;
    }
  }

  close() {
    this.router.navigate(['/list-evenement']);
  }

  updatePoint() {
    const content = {
      pointId: this.pointId,
      lieu: this.lieu,
      type: 'event',
      date: this.date,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
    };

    console.log('Contenu mis à jour :', content);

    this.pointsService.$updatePoint(content).subscribe((data: any) => {
      if (data && data.success === true) {

        presentToast("L'événement a été modifié avec succès !", 'bottom', 'success');
        this.router.navigate(['list-evenement']);
      }
    });
  }

  setValue(newValue: string[] | string, input: string) {
    console.log('Valeur reçue :', newValue);

    if (Array.isArray(newValue) && newValue.length >= 2) {
      const [dateDebut, dateFin] = newValue;
      this.date =
        this.formatDateAndTime(dateDebut, 'date') + ' - ' + this.formatDateAndTime(dateFin, 'date');
    } else if (typeof newValue === 'string') {
      this.date = this.formatDateAndTime(newValue, 'date');
    }

    switch (input) {
      case 'timeBegin':
        this.heureDebut = this.formatDateAndTime(newValue as string, 'time');
        break;
      case 'timeEnd':
        this.heureFin = this.formatDateAndTime(newValue as string, 'time');
        break;
      default:
        break;
    }
  }

  formatDateAndTime(getvalue: string, format: string): string {
    const date = new Date(getvalue);
    if (isNaN(date.getTime())) {
      console.log('Date invalide reçue :', getvalue);
      return 'Non définie'; // Retourne "Non définie" si la date est invalide
    }

    switch (format) {
      case 'date':
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      case 'time':
        return `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`;
      default:
        return '';
    }
  }

  async onAddressInput() {
    if (this.lieu.length > 3) {
      try {
        const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.lieu)}&format=json&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`
        );
        this.suggestions = response.data;
        console.log('Suggestions d\'adresse :', this.suggestions);
        if (!Array.isArray(this.suggestions) || this.suggestions.length === 0) {
          presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
        }
        this.isLocationValid = false;
        this.selectedposition = { name: '', display_name: '', lat: 0, lon: 0 };
      } catch (error: any) {
        console.error('Erreur lors de la récupération des suggestions :', error);
      }
    } else {
      this.suggestions = [];
      this.isLocationValid = false;
      this.selectedposition = { name: '', display_name: '', lat: 0, lon: 0 };
    }
  }

  onSelectAddress(selectedAddress: any) {
    console.log('Adresse sélectionnée :', selectedAddress);
    this.selectedposition = {
      name: selectedAddress.name,
      display_name: selectedAddress.display_name,
      lat: selectedAddress.lat,
      lon: selectedAddress.lon,
    };

    this.lieu = selectedAddress.display_name;
    this.isLocationValid = true;
  }

  blurInput() {
    setTimeout(() => {
      this.focusInput = false;
    }, 100);
  }
}
