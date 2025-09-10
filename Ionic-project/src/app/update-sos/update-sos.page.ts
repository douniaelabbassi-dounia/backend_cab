import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';

@Component({
  selector: 'app-update-sos',
  templateUrl: './update-sos.page.html',
  styleUrls: ['./update-sos.page.scss'],
})
export class UpdateSosPage implements OnInit {
  message: string = '';
  phoneNumber: string = '';
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
  
      this.pointsService.$getPoints().subscribe((data: any) => {
        console.log('Données reçues depuis l\'API :', data);
        const jaunePoint = data.sos?.find((point: any) => point.id == id);

        if (jaunePoint) {
          this.message = jaunePoint.msg || '';
          this.phoneNumber = jaunePoint.numeroTel || '';
  
          console.log('Message :', this.message, 'Numéro de téléphone :', this.phoneNumber);
        } else {
          console.log('No SOS data found with the provided ID.');
        }
      });
    } else {
      console.log('ID nul : impossible de récupérer les détails.');
    }
  }
  
  
  
  close() {
    this.router.navigate(['/map']);
  }

  updatePoint() {
    const content = {
      pointId: this.pointId,
      msg: this.message,
      type: 'jaune',
      numeroTel: this.phoneNumber,
    };

    console.log('Contenu mis à jour :', content);

    this.pointsService.$updatePoint(content).subscribe((data: any) => {
      if (data && data.success === true) {
        try { localStorage.setItem('justUpdatedSosId', String(this.pointId)); } catch {}
        presentToast('Le SOS a été modifié avec succès !', 'bottom', 'success');
        this.router.navigate(['/map']);
      }
    });
  }

  
}
