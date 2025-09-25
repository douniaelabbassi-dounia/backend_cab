import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';
import { ParticipationService } from 'src/app/utiles/services/participation/participation.service';
import { URL_BASE } from 'src/environments/environment';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {
  URL = URL_BASE;
  imgCacheBust = Date.now();
  
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
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  
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
        // Bust image cache so updated avatars show immediately
        this.imgCacheBust = Date.now();
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
  
  async choiceMethod(event: 'takePic' | 'getPic') {
    try {
      if (event === 'takePic') {
        const image = await CapacitorCamera.getPhoto({
          quality: 80,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        if (image && image.dataUrl) {
          const resized = await this.resizeImage(image.dataUrl, 512);
          await this.uploadProfileImage(resized);
        }
      } else if (event === 'getPic') {
        // Fallback to file input for broad device support
        if (this.fileInputRef && this.fileInputRef.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
          this.fileInputRef.nativeElement.click();
        }
      }
    } catch (e) {
      console.error('Image choice error', e);
    } finally {
      // Keep modal state predictable: close after action selection
      this.sourceModal = false;
    }
  }
  
  onFileSelected(event: any) {
    const file: File | undefined = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const resized = await this.resizeImage(dataUrl, 512);
      await this.uploadProfileImage(resized);
    };
    reader.readAsDataURL(file);
  }

  private resizeImage(dataUrl: string, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale to fit within maxSize while preserving aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  private async uploadProfileImage(base64DataUrl: string) {
    try {
      const res: any = await firstValueFrom(this.authService.$updateProfileImage({ image: base64DataUrl }));
      // Refresh local profile info for immediate UI update
      await new Promise<void>((resolve) => {
        this.authService.$profil().subscribe({
          next: (data: any) => {
            this.profilInfo = data;
            this.friendsList = data.friends || [];
            this.authService.$userinfo = data; // keeps menu avatar in sync
            this.imgCacheBust = Date.now();
            resolve();
          },
          error: () => resolve()
        });
      });
    } catch (e) {
      console.error('Failed to upload profile image', e);
    }
  }

  // Build a correct storage URL regardless of API base having '/api'
  storageUrl(path: string): string {
    const host = this.URL.replace(/\/(api|api\/)$/, '/');
    const url = host + 'storage/' + path.replace(/^\/*/, '');
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'v=' + this.imgCacheBust;
  }

  imageSrc(path?: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      const sep = path.includes('?') ? '&' : '?';
      return path + sep + 'v=' + this.imgCacheBust;
    }
    return this.storageUrl(path);
  }

  ngOnDestroy() {
    if (this.participationSub) {
      this.participationSub.unsubscribe();
    }
  }
}
