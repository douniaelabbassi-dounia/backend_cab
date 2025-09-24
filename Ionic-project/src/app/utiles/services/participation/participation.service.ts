import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
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

  constructor(private apiService: ApiService) {}

  setUserId(userId: string) {
    this.currentUserId = userId;
    this.loadUserParticipation(userId);
  }

  private checkDailyReduction(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.currentUserId) {
        return resolve(0);
      }
      this.apiService.processDailyReduction(this.currentUserId).subscribe({
        next: (response: any) => resolve(response.currentPoints),
        error: (error) => {
          console.error('Failed to process daily reduction:', error);
          resolve(0);
        }
      });
    });
  }

  getCurrentPoints(): number {
    return this.pointsSubject.value;
  }

  // Force a fresh fetch from backend and update the observable once
  public refresh(): void {
    if (!this.currentUserId) { return; }
    this.apiService.getUserParticipation(this.currentUserId).subscribe({
      next: (res: any) => {
        const pts = (res && typeof res.currentPoints === 'number') ? res.currentPoints : 0;
        this.pointsSubject.next(pts);
      },
      error: (error) => {
        console.error('Failed to refresh participation via API:', error);
      }
    });
  }

  private loadUserParticipation(userId: string) {
    // Authoritative: use participation API only to avoid flicker from stale profile field.
    this.apiService.getUserParticipation(userId).subscribe({
      next: async (res: any) => {
        try {
          if (!res || res.exists === false) {
            // Initialize once on backend
            this.apiService.initializeUserParticipation(userId).subscribe({
              next: (init: any) => this.pointsSubject.next(init.currentPoints ?? 0),
              error: (e) => {
                console.error('Failed to initialize user on backend:', e);
                this.pointsSubject.next(0);
              }
            });
            return;
          }

          // Process daily reduction then emit a single, final value
          const finalPoints = await this.checkDailyReduction();
          this.pointsSubject.next(finalPoints || res.currentPoints || 0);
        } catch (err) {
          console.error('Error during participation load sequence:', err);
          this.pointsSubject.next(res?.currentPoints ?? 0);
        }
      },
      error: (error) => {
        console.error('Failed to load participation via API:', error);
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
