import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-evenement',
  templateUrl: './list-evenement.page.html',
  styleUrls: ['./list-evenement.page.scss'],
})
export class ListEvenementPage {
  allMyEvents: any[] = [];
  activeEvents: any[] = [];
  isLoading: boolean = true;
  isDeleting: boolean = false;
  displayDeleteConfirmation: boolean = false;
  content: string = "Êtes-vous sûr de vouloir supprimer cet événement ?";
  selectedEvent: number | undefined;

  constructor(
    private router: Router,
    private pointsService: ListPointsService,
    private navController: NavController
  ) { }

  ionViewWillEnter() {
    this.getEventPoints();
  }

  /**
   * FIX: Rewritten logic to robustly check if an event is currently active.
   * This now correctly handles date ranges and time comparisons against the current real date and time.
   */
  isEventActive(event: any): boolean {
    if (!event?.date || !event.heureDebut) {
      return false; // Cannot determine status without date and start time.
    }

    const now = new Date();

    const parseDateString = (dateStr: string): Date | null => {
        const parts = dateStr.trim().split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
              // JS month is 0-indexed
              return new Date(year, month - 1, day);
            }
        }
        return null;
    };

    const dateParts = event.date.split(' - ');
    const startDate = parseDateString(dateParts[0]);
    const endDate = dateParts.length > 1 ? parseDateString(dateParts[1]) : startDate;

    if (!startDate || !endDate) {
        console.error(`Could not parse date for event ${event.id}: ${event.date}`);
        return false;
    }

    const [startHour, startMinute] = event.heureDebut.split(':').map(Number);
    const startDateTime = new Date(startDate.getTime());
    startDateTime.setHours(startHour, startMinute, 0, 0);

    let endDateTime;
    if (event.heureFin) {
        const [endHour, endMinute] = event.heureFin.split(':').map(Number);
        endDateTime = new Date(endDate.getTime());
        endDateTime.setHours(endHour, endMinute, 0, 0);
    } else {
        // If no end time, assume it lasts until the end of the final day.
        endDateTime = new Date(endDate.getTime());
        endDateTime.setHours(23, 59, 59, 999);
    }

    // The final check: is the current moment between the event's start and end datetimes?
    return now >= startDateTime && now <= endDateTime;
  }


  getEventPoints() {
    this.isLoading = true;
    this.pointsService.$getMyPoints(true).subscribe({ // Pass true to force refresh
      next: (data: any) => {
        this.allMyEvents = data.event || [];
        // Re-enable the corrected filtering logic
        this.activeEvents = this.allMyEvents.filter(event => this.isEventActive(event));
        this.isLoading = false;
        console.log("All my events", this.allMyEvents);
        console.log("Filtered active events", this.activeEvents);
      },
      error: (err) => {
        console.error("Error fetching events", err);
        presentToast("Erreur lors du chargement des événements.", 'bottom', 'danger');
        this.isLoading = false;
      }
    });
  }

  goMap() {
    this.navController.back();
  }

  updateEvent(id: number) {
    this.router.navigate(['/update-evenement/' + id]);
  }

  showConfirmation(id: number) {
    this.selectedEvent = id;
    this.displayDeleteConfirmation = true;
  }

  deletePoint(eventData: { id: number, type: string }) {
    if (this.isDeleting) return;

    this.isDeleting = true;
    const idToDelete = eventData.id;

    let json = {
      "pointId": idToDelete,
      "type": "event"
    };

    this.pointsService.$deletePoint(json).subscribe({
      next: (data: any) => {
        presentToast("L'événement a été supprimé avec succès!", "bottom", "success");
        // Remove the event from the local lists for an instant UI update
        this.allMyEvents = this.allMyEvents.filter(e => e.id !== idToDelete);
        this.activeEvents = this.activeEvents.filter(e => e.id !== idToDelete);
      },
      error: (err) => {
        presentToast("Erreur lors de la suppression!", "bottom", "danger");
        this.isDeleting = false; // Re-enable on error
      },
      complete: () => {
        this.isDeleting = false;
      }
    });
  }
}