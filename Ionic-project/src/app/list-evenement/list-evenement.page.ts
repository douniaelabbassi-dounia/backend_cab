import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';

@Component({
  selector: 'app-list-evenement',
  templateUrl: './list-evenement.page.html',
  styleUrls: ['./list-evenement.page.scss'],
})
export class ListEvenementPage {

  listEvents:any = [];
  isDeleting: boolean = false; 
  displayDeleteConfirmation:boolean = false;
  content:string = "êtes-vous sûr de vouloir supprimer ce point ?";
  selectedEvent:number|undefined;
  constructor(
    private router:Router,
    private pointsService:ListPointsService
  ) { }

  ionViewWillEnter() {
    this.getEventPoints();
  }

  ionViewdidLeave(): void {
      this.listEvents = []
      console.log('you left the page !!!');

  }

  getEventPoints(){
    this.pointsService.$getMyPoints().subscribe((data:any) => {
      this.listEvents = data.event;
      console.log("all events", this.listEvents);
    });
  }

  goMap() {
    this.router.navigate(["/map"])
  }

  updateEvent(id:number){
    this.router.navigate(['/update-evenement/'+id])
  }


  showConfirmation(id:number){
    this.selectedEvent = id;
    this.displayDeleteConfirmation = true;
  }


deletePoint(id: number) {
  if (this.isDeleting) return; // Empêcher plusieurs suppressions simultanées

  this.isDeleting = true; // Début du processus de suppression

  let json = {
    "pointId": id,
    "type": "event"
  };

  this.pointsService.$deletePoint(json).subscribe({
    next: (data: any) => {
      presentToast("L'événement a été supprimé avec succès!", "bottom", "success");
      this.getEventPoints();
    },
    error: (err) => {
      presentToast("Erreur lors de la suppression!", "bottom", "danger");
    },
    complete: () => {
      this.isDeleting = false; // Réactiver après la suppression
    }
  });
}

  dateStructor(date: string): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} à ${hours}h${minutes}`;
  }

}
