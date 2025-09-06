import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NoteAmis } from '../../utiles/interface/note-amis';
import { ProfilService } from '../../utiles/services/profil/profil.service';
import { URL_BASE } from 'src/environments/environment';
import { presentToast } from 'src/app/utiles/component/notification';
import { NavController } from '@ionic/angular';
import { ListPointsService } from 'src/app/utiles/services/points/list-points.service';
import { ParticipationService } from 'src/app/utiles/services/participation/participation.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  Math = Math;
  URL = URL_BASE; // TO USE THE URL ON TEMPLATE
  friendsList: Array<any> = []
  profilInfo: any;
  width: number = 0
  key: string = ''


  sourceModal: boolean = false
  sourceChoice: string = ''
  selectedFile: File | undefined;
  participationProgress!: number;
  currentParticipationPoints: number = 0;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;


  error_messages_global = [
    /*0*/ { name: "image", message: "La taille d'image doit avoir 300px X 300px.", display: false, input: 'https://media.istockphoto.com/id//vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=' },

  ]


  partisipation: any = { 'w-[0vw]': true };
  imageRecto: string = '';
  imageProfile: string = ''
  @ViewChild('progressBar', { static: false }) progressBar !: ElementRef;

  constructor(private router: Router, private camera: Camera, private navController: NavController,
    private profilService: ProfilService,
    private pointService: ListPointsService,
    private participationService: ParticipationService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  async ngOnInit() {
    await this.profil();
    this.profilInfo = this.profilService.$userinfo;
    // getUserByPoints() will be called from within profil() after we get the response
  }

  async ionViewDidEnter() {
    await this.profil();
    this.navController.navigateRoot(['/profil']);
    this.friendsList = this.profilService.$friendsList;
    // Don't call getUserByPoints again - it's already called in ngOnInit
  }

  ionViewWillEnter() {
    // Clear any existing views in the stack
  }
  ngAfterViewInit() {
    if (this.progressBar) {
      console.log('progressBar is defined');
    } else {
      console.log('progressBar is not defined');
    }
  }

  async getUserByPoints() {
    console.log('🎯 getUserByPoints called');
    console.log('🆔 User ID:', this.profilInfo?.id);
    
    const userId = this.profilInfo?.id;
    if (userId) {
      console.log('✅ Setting up participation service for user:', userId);
      
      // Only subscribe to points updates, don't trigger multiple API calls
      this.participationService.points$.subscribe(points => {
        console.log('📊 Updated participation points:', points);
        // Ensure points is a valid number
        const validPoints = isNaN(points) ? 0 : Math.max(0, Math.min(50, points));
        this.participationProgress = (validPoints / 50) * 100;
        console.log('📈 Progress calculated:', this.participationProgress);
        this.updateParticipationUI();
      });
      
      // Set user ID ONCE - this triggers the API call
      this.participationService.setUserId(userId);
    } else {
      console.log('❌ No user ID found');
    }
  }

  updateParticipationUI() {
    console.log('🎨 UpdateUI - Progress:', this.participationProgress);
    
    if (this.progressBar && this.progressBar.nativeElement) {
      this.renderer.setStyle(this.progressBar.nativeElement, 'width', `${this.participationProgress}%`);
      this.changeDetectorRef.detectChanges();
    }
  }
  goPage(page: any) {
    this.navController.navigateForward(page)
  }

  //use api to add likes && dislikes later
  like() {
    this.profilInfo.likes = 1;
  }

  dislike() {
    this.profilInfo.dislikes = 1;
  }
  goTo(page: string) {

    switch (page) {
      case 'friends':
        this.router.navigate(["/gestion-amis"])
        break;

      case 'map':
        this.router.navigate(["/map"])
        break;

      case 'updateProfil':
        this.router.navigate(["/update-profil"])
        break;

      default:
        break;
    }
  }

  async profil() {
    console.log('📞 Calling profil() method');
    this.profilService.$profil().subscribe(
      (data: any) => {
        console.log('🔍 Profile API Response:', data);
        console.log('🎯 Participation in response:', data.participation);
        this.profilService.$userinfo = data;
        this.profilInfo = this.profilService.$userinfo;
        
        // Now that we have profile data, set up participation
        if (data.participation_score !== undefined) {
          console.log('🚀 Setting participation points from profile:', data.participation_score);
          const points = data.participation_score;
          this.participationService['pointsSubject'].next(points);
          this.currentParticipationPoints = points;
          this.participationProgress = (points / 50) * 100;
          this.updateParticipationUI();
        }
      },
      (err) => {
        console.log('error : ' + err);
      }
    );
  }

  // Profile image upload

  choiceModal(choice: string) {
    console.log('source modal initial', this.sourceModal)
    this.sourceModal = !this.sourceModal;
    console.log('source modal last', this.sourceModal)

    if (this.sourceModal) {
      this.sourceChoice = choice
    } else {
      this.sourceChoice = ''
    }

    console.log('from : ' + this.sourceChoice);

  }

  choiceMethod(choice: any) {
    console.log(choice + ' ------> ' + this.sourceChoice);

    switch (choice) {
      case 'takePic':
        this.takePhoto(this.sourceChoice);
        break;

      case 'getPic':
        this.getPhoto(this.sourceChoice);
        break;
      default:
        break;
    }
  }

  takePhoto(document: string) {
    const cameraOptions: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    };

    this.camera.getPicture(cameraOptions)
      .then((imageData) => {
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        if (document == 'profil') {
          this.error_messages_global[0].input = base64Image;
          this.uploadImages('profil', 'image');
        } else {
          presentToast('veuillez ajouter une image de profile', 'bottom', 'success');

        }

      })
      .catch((error) => {
        presentToast(JSON.stringify(error), 'bottom', 'danger');
      });
  }


  getPhoto(document: string) {
    const cameraOptions: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    this.camera.getPicture(cameraOptions)
      .then((imageData) => {
        console.log('this image data', imageData)
        const base64Image = 'data:image/jpeg;base64,' + imageData;

        if (document == 'profil') {
          this.error_messages_global[0].input = base64Image;
          this.uploadImages('profil', 'image');
        } else {
          presentToast('veuillez ajouter une image de profile', 'bottom', 'success');

        }

      })
      .catch((error) => {
        // alert(JSON.stringify(error));
        console.log('from backend', JSON.stringify(error))
        presentToast(JSON.stringify(error), 'bottom', 'danger');
      });
  }

  uploadImages(face: string, type: string) {
    let image;
    if (face == "profil") {
      image = this.error_messages_global[0].input
      console.log("profile image input", image)
    }

    let content = {
      image,
      type
    }
    this.profilService.$uploadImage(content).subscribe(
      async (data: any) => {
        console.log('Upload response:', data);
        this.imageProfile = data.image_id;
        console.log("the image id", this.imageProfile);
        console.log('image dataa', this.imageProfile)
        this.sourceModal = false
        presentToast('Image de profil uploadée avec succès', 'bottom', 'success');
      },
      (err: any) => {
        presentToast('error : ' + JSON.stringify(err), 'bottom', 'danger')
      }
    );
    this.updateprofile()
  }

  updateprofile() {
    let content = {
      image: this.imageProfile,
    }
    this.profilService.$updatePrsonalInfo(content).subscribe((data: any) => {
      console.log('data from updating user info image', data)
      this.error_messages_global[0].input = data?.image;
      this.profilService.$userinfo = data;
      presentToast('vos informations personnelles ont été mises à jour!', 'bottom', 'success')

    })
  }

}
