import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';
import { ParticipationService } from 'src/app/utiles/services/participation/participation.service';
import { URL_BASE } from 'src/environments/environment';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {
  URL = URL_BASE;
  
  // These are the variables your HTML template is using
  profilInfo: any;
  friendsList: any[] = [];
  
  menuDisplay: boolean = false;
  selectedBtn: string = 'personal';

  // Participation Points variables
  currentPoints: number = 0;
  maxPoints: number = 50;
  isLoadingParticipation: boolean = true;
  private participationSub!: Subscription;
  
  // Variables for modals and file uploads (added for completeness)
  sourceModal: boolean = false;
  
  constructor(
    private authService: ProfilService,
    private navController: NavController,
    public participationService: ParticipationService
  ) { }

  ngOnInit() {
    // Avoid showing the initial BehaviorSubject default (0) as a flicker.
    // Only react after the first real backend update.
    this.participationSub = this.participationService.points$
      .pipe(skip(1))
      .subscribe(points => {
        this.currentPoints = points;
        this.isLoadingParticipation = false;
      });
  }

  ionViewWillEnter() {
    this.loadProfileData();
  }

  get participationPercentage(): number {
    if (!this.maxPoints) return 0;
    const percentage = (this.currentPoints / this.maxPoints) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  loadProfileData() {
    this.authService.$profil().subscribe({
      next: (data: any) => {
        // Assign the data to the correct variables used by the template
        this.profilInfo = data;
        this.friendsList = data.friends || [];
        this.authService.$userinfo = data;

        if (this.profilInfo && this.profilInfo.id) {
          this.participationService.setUserId(this.profilInfo.id);
        }
      },
      error: (err) => {
        console.error('Error fetching profile data: ' + err.error.message);
        this.isLoadingParticipation = false;
      }
    });
  }

  goPage(page: string) {
    // Restore original behavior and transition
    this.navController.navigateForward(page);
  }

  goTo(page: string) {
    this.navController.navigateForward(page);
  }

  // Placeholder methods to prevent template errors
  like() {
    console.log('Like clicked');
  }

  dislike() {
    console.log('Dislike clicked');
  }

  choiceModal(type: string) {
    console.log('Choice modal for:', type);
    this.sourceModal = !this.sourceModal;
  }
  
  choiceMethod(event: any) {
     console.log('Choice method event:', event);
  }
  
  onFileSelected(event: any) {
     console.log('File selected:', event);
  }

  ngOnDestroy() {
    if (this.participationSub) {
      this.participationSub.unsubscribe();
    }
  }
}
