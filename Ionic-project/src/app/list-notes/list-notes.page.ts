import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.page.html',
  styleUrls: ['./list-notes.page.scss'],
})
export class ListNotesPage {

  listNotes: any = [];
  isDeleting: boolean = false;
  displayDeleteConfirmation: boolean = false;
  content: string = "êtes-vous sûr de vouloir supprimer cette note ?";
  selectedNoteId: number | undefined;

  constructor(
    private router: Router,
    private pointsService: ListPointsService,
    private navController: NavController
  ) { }

  ionViewWillEnter() {
    this.getNotePoints();
  }

  getNotePoints() {
    this.pointsService.$getMyPoints().subscribe({
      next: (data: any) => {
        this.listNotes = data.note;
        console.log("All my notes", this.listNotes);
      },
      error: (err: any) => {
        presentToast("Erreur lors du chargement des notes.", "bottom", "danger");
        console.error(err);
      }
    });
  }

  goMap() {
    this.navController.back();
  }

  updateNote(id: number) {
    this.router.navigate(['/update-note/' + id]);
  }

  showConfirmation(id: number) {
    this.selectedNoteId = id;
    this.displayDeleteConfirmation = true;
  }

  deletePoint(id: number) {
    if (this.isDeleting) return;
    this.isDeleting = true;

    let json = {
      "pointId": id,
      "type": "note"
    };

    this.pointsService.$deletePoint(json).subscribe({
      next: (data: any) => {
        presentToast("La note a été supprimée avec succès!", "bottom", "success");
        this.getNotePoints(); // Refresh the list
      },
      error: (err: any) => {
        presentToast("Erreur lors de la suppression!", "bottom", "danger");
      },
      complete: () => {
        this.isDeleting = false;
      }
    });
  }

  dateStructor(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}h${minutes}`;
  }
}