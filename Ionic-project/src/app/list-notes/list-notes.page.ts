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
  private readonly dayDisplayOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  private readonly dayAliasMap: Record<string, string> = {
    '0': 'Dim', '7': 'Dim', 'dim': 'Dim', 'dimanche': 'Dim', 'sun': 'Dim', 'sunday': 'Dim',
    '1': 'Lun', 'lun': 'Lun', 'lundi': 'Lun', 'mon': 'Lun', 'monday': 'Lun',
    '2': 'Mar', 'mar': 'Mar', 'mardi': 'Mar', 'tue': 'Mar', 'tuesday': 'Mar',
    '3': 'Mer', 'mer': 'Mer', 'mercredi': 'Mer', 'wed': 'Mer', 'wednesday': 'Mer',
    '4': 'Jeu', 'jeu': 'Jeu', 'jeudi': 'Jeu', 'thu': 'Jeu', 'thursday': 'Jeu',
    '5': 'Ven', 'ven': 'Ven', 'vendredi': 'Ven', 'fri': 'Ven', 'friday': 'Ven',
    '6': 'Sam', 'sam': 'Sam', 'samedi': 'Sam', 'sat': 'Sam', 'saturday': 'Sam',
    '*': '*'
  };

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
        this.listNotes = (data.note || []).map((note: any) => ({
          ...note,
          formattedDays: this.formatDays(note?.date),
          formattedTime: this.formatTime(note?.heureDebut)
        }));
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

  private formatDays(raw: any): string {
    const tokens: string[] = Array.isArray(raw)
      ? raw
      : typeof raw === 'string'
        ? raw.split(',')
        : [];
    const canonical = new Set<string>();
    let includesAll = false;

    tokens.map((token) => token.trim()).filter(Boolean).forEach((token) => {
      const lower = token.toLowerCase();
      if (lower === '*' || lower === 'tous' || lower === 'tous les jours') {
        includesAll = true;
        return;
      }
      const alias = this.dayAliasMap[lower];
      if (alias && alias !== '*') {
        canonical.add(alias);
        return;
      }
      const numeric = parseInt(lower, 10);
      if (!Number.isNaN(numeric)) {
        if (numeric === 7) {
          canonical.add('Dim');
        } else if (numeric >= 0 && numeric <= 6) {
          const order = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          canonical.add(order[numeric]);
        }
      }
    });

    if (includesAll) {
      return 'Tous les jours';
    }
    if (canonical.size === 0) {
      return 'Aucun jour défini';
    }

    const ordered = this.dayDisplayOrder.filter((day) => canonical.has(day));
    return ordered.join(', ');
  }

  private formatTime(time: string): string {
    if (!time) {
      return '—';
    }
    const [hours, minutes = '00'] = time.split(':');
    const hh = hours?.padStart(2, '0') ?? '00';
    const mm = minutes?.padStart(2, '0') ?? '00';
    return `${hh}h${mm}`;
  }
}
