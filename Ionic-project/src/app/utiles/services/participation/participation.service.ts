import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ProfilService } from '../profil/profil.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private readonly INITIAL_POINTS = 40;
  private readonly MAX_POINTS = 50;
  private currentUserId: string | null = null;

  private pointsSubject = new BehaviorSubject<number>(0);
  public points$ = this.pointsSubject.asObservable();

  constructor(private apiService: ApiService, private profilService: ProfilService) {}

  setUserId(userId: string) {
    this.currentUserId = userId;
    this.loadUserParticipation(userId);
  }

  private checkDailyReduction() {
    if (this.currentUserId) {
      this.apiService.processDailyReduction(this.currentUserId).subscribe({
        next: (response: any) => {
          this.pointsSubject.next(response.currentPoints);
        },
        error: (error) => {
          console.error('Failed to process daily reduction:', error);
          this.pointsSubject.next(0);
        }
      });
    }
  }

  getCurrentPoints(): number {
    return this.pointsSubject.value;
  }

  private loadUserParticipation(userId: string) {
    // Use existing profile endpoint that now includes participation data
    this.profilService.$profil().subscribe({
      next: (response: any) => {
        console.log('Profile response with participation:', response);
        if (response.participation_score !== undefined) {
          this.pointsSubject.next(response.participation_score);
          this.checkDailyReduction();
        } else {
          this.initializeUserOnBackend(userId);
        }
      },
      error: (error) => {
        console.error('Failed to load participation from profile:', error);
        this.pointsSubject.next(0);
      }
    });
  }

  private initializeUserOnBackend(userId: string) {
    this.apiService.initializeUserParticipation(userId).subscribe({
      next: (response: any) => {
        this.pointsSubject.next(response.currentPoints);
      },
      error: (error) => {
        console.error('Failed to initialize user on backend:', error);
        this.pointsSubject.next(0);
      }
    });
  }

  addPoints(points: number): number {
    if (this.currentUserId) {
      this.apiService.updateUserPoints(this.currentUserId, points, 'add').subscribe({
        next: (response: any) => {
          this.pointsSubject.next(response.currentPoints);
        },
        error: (error) => {
          console.error('Failed to add points on server:', error);
        }
      });
    }
    return this.getCurrentPoints();
  }

  removePoints(points: number): number {
    if (this.currentUserId) {
      this.apiService.updateUserPoints(this.currentUserId, -points, 'remove').subscribe({
        next: (response: any) => {
          this.pointsSubject.next(response.currentPoints);
        },
        error: (error) => {
          console.error('Failed to remove points on server:', error);
        }
      });
    }
    return this.getCurrentPoints();
  }

  // Point rewards based on activity type
  rewardAffluenceLevel1(): number {
    return this.addPoints(1);
  }

  rewardAffluenceLevel2(): number {
    return this.addPoints(5);
  }

  rewardAffluenceLevel3(): number {
    return this.addPoints(10);
  }

  rewardAffluenceLevel4(): number {
    return this.addPoints(10);
  }

  rewardAffluenceLevel0(): number {
    return this.addPoints(10);
  }

  rewardEvent(): number {
    return this.addPoints(3);
  }

  rewardLike(): number {
    return this.addPoints(1);
  }

  rewardAirportWait(): number {
    return this.addPoints(10);
  }

  penalizeFalseReport(): number {
    return this.removePoints(20);
  }

  getParticipationPercentage(): number {
    return Math.min(100, (this.getCurrentPoints() / this.MAX_POINTS) * 100);
  }

  canUseFeatures(): boolean {
    return this.getCurrentPoints() > 0;
  }
}