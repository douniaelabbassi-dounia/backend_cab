import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { presentToast } from 'src/app/utiles/component/notification';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  accepteCondition(value:any) {
    if(value.checked){
      this.error_messages_global[8].display = false;
      this.error_messages_global[8].input = 'accepted';
      console.log('');
    }else if(!value.checked){
      this.error_messages_global[8].display = true;
      this.error_messages_global[8].input = '';
    }
  }

    imagePreviewRecto: string | ArrayBuffer | null = null;
    imagePreviewVerso: string | ArrayBuffer | null = null;


    registerAs:string = "chauffeur";
    categorie:string = 'berline';
    messageErroshow:string = "";

    imageProfile:string = ''
    imageRecto:string = ''
    imageVerso:string = ''

    error_messages_chauffeur:any = [
      /*0*/ {name: "pseudo",message:"Pseudo est obligatoire.", display:false, input:''},
      /*1*/ {name: "brand",message:"La vehicule information est obligatoire.", display:false, input:''},
      /*2*/ {name: "recto",message:"La photo recto de la carte est obligatoire.", display:false, input:''},
      /*3*/ {name: "verso",message:"La photo verso de la carte est obligatoire.", display:false, input:''},
      /*4*/ {name: "carte",message:"Numero de la carte est obligatoire.", display:false, input:''},
    ];

    error_messages_organizateur:any = [
      /*0*/ {name: "organization",message:"Le nom d'établissement est obligatoire.", display:false, input:''},
      /*1*/ {name: "address",message:"L'adresse d'établissement est obligatoire.", display:false, input:''},
    ];

    error_messages_global = [
      /*0*/ {name: "image",message:"La taille d'image doit avoir 300px X 300px.", display:false, input:'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg='},
      /*1*/ {name: "lastname",message:"Le nom est obligatoire.", display:false, input:''},
      /*2*/ {name: "firstname",message:"Le prenom est obligatoire.", display:false, input:''},
      /*3*/ {name: "email",message:"L'email est obligatoire", display:false, input:''},
      /*4*/ {name: "emailformat",message:"veuillez entrer le format d'e-mail correct !", display:false, input:'email format'},
      /*5*/ {name: "password",message:"Le mot de passe est obligatoire.", display:false, input:''},
      /*6*/ {name: "passConfirm",message:"Confirmation du mot de passe est obligatoire.", display:false, input:''},
      /*7*/ {name: "passMatching",message:"les mots de passe ne correspondent pas ! ", display:false, input:'mating password'},
      /*8*/ {name: "condition",message:"l'acceptation des conditions du contrat est requise", display:false, input:''},
    ]

    sourceModal:boolean= false
    sourceChoice:string=''

    constructor(
      private router:Router,
      private camera:Camera,
      private platform:Platform,
      private authService:ProfilService
    ) { }

    ngOnInit() {
    }

    choiceModal(choice:string){
      this.sourceModal = !this.sourceModal;
      if(this.sourceModal){
        this.sourceChoice = choice
      }else{
        this.sourceChoice = ''
      }

      console.log('from : ' + this.sourceChoice);

    }

    choiceMethod(choice:any){
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

    async takePhoto(document:string) {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        try {
          const image = await CapacitorCamera.getPhoto({
            quality: 30,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera, // This opens camera
          });
          
          console.log('Capacitor camera data received');
          this.handlePhotoResult(image.dataUrl!, document);
        } catch (error) {
          console.log('Capacitor camera error:', error);
          presentToast('Erreur lors de la prise de photo', 'bottom', 'danger');
        }
      } else {
        this.takePhotoWeb(document);
      }
    }

    takePhotoWeb(document: string) {
      const input = (window.document as Document).createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.handlePhotoResult(e.target.result, document);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    }


    async getPhoto(document:string) {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        try {
          const image = await CapacitorCamera.getPhoto({
            quality: 30,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Photos, // This opens gallery
          });
          
          console.log('Capacitor image data received');
          this.handlePhotoResult(image.dataUrl!, document);
        } catch (error) {
          console.log('Capacitor camera error:', error);
          presentToast('Erreur lors de la sélection de l\'image', 'bottom', 'danger');
        }
      } else {
        this.getPhotoWeb(document);
      }
    }

    getPhotoWeb(document: string) {
      const input = (window.document as Document).createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.handlePhotoResult(e.target.result, document);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    }

    handlePhotoResult(base64Image: string, document: string) {
      if(document == 'recto'){
        this.imagePreviewRecto = base64Image;
        this.error_messages_chauffeur[2].input = base64Image;
      }else if(document == 'verso'){
        this.imagePreviewVerso = base64Image;
        this.error_messages_chauffeur[3].input = base64Image;
      }else if(document == 'profil'){
        this.error_messages_global[0].input = base64Image;
      }
      
      this.sourceModal = false;
    }


    back(){
      this.router.navigate(["/sign-in"])
    }

    validation(){
      this.error_messages_chauffeur.map((el:any) => el.display = false);
      this.error_messages_global.map((el:any) => el.display = false);
      this.error_messages_organizateur.map((el:any) => el.display = false);
      if(this.registerAs == "chauffeur"){
        console.log('i\'m in chauffeur condition. array length is :' + this.error_messages_chauffeur.length);

        for(let i=0; i < this.error_messages_chauffeur.length; i++){
          console.log('this '+this.error_messages_chauffeur[i].name+' value : '+ this.error_messages_chauffeur[i].input);
          if(i == 1) continue; // Skip brand validation for now
          
          if(this.error_messages_chauffeur[i].input == "") {
            this.error_messages_chauffeur[i].display = true;
          }
        }

      }else if(this.registerAs == 'organisateur'){
        console.log('i\'m in organisateur condition. array length is :' + this.error_messages_organizateur.length);

        for(let i=0; i < this.error_messages_organizateur.length; i++){
          console.log('this '+this.error_messages_organizateur[i].name+' value : '+ this.error_messages_organizateur[i].input);
          if(this.error_messages_organizateur[i].input == ""){
            this.error_messages_organizateur[i].display = true;
          }
        }
      }

      for(let i=0; i<=this.error_messages_global.length-1;i++){
        if(i==3){
          if(this.error_messages_global[i].input != "" && this.isNotEmail(this.error_messages_global[i].input)){
            this.error_messages_global[i+1].display = true;
          }
        }if(i==5){
          if(this.error_messages_global[i].input == ''){
            this.error_messages_global[i].display = true;
          }

          if(this.error_messages_global[i].input !== this.error_messages_global[i+1].input){
            this.error_messages_global[i+2].display = true;
          }
        }else {
          if(this.error_messages_global[i].input == "" ){
            this.error_messages_global[i].display = true;
          }
        }
      }
      const allEqual = (arr:any) => arr.every((error:any) => error.input !== "");
      
      // Custom validation for chauffeur images
      const chauffeurValid = () => {
        const basicFieldsValid = this.error_messages_chauffeur.every((error:any, index:number) => {
          if(index == 1) return true; // Skip brand validation
          return error.input !== "";
        });
        return basicFieldsValid;
      };
      
      console.log(this.error_messages_global);

      if(this.registerAs == "chauffeur"){
        console.log(this.error_messages_chauffeur);
        console.log('imageRecto:', this.imageRecto, 'imageVerso:', this.imageVerso);

        return chauffeurValid() && allEqual(this.error_messages_global);
      }else if(this.registerAs == 'organisateur'){
        console.log(this.error_messages_organizateur);
        return allEqual(this.error_messages_organizateur) && allEqual(this.error_messages_global);
      }

    }

    changeRegisterAs(value:any){
      console.log("this is the value Role : " + value.value)
      this.clearInputs()
      this.registerAs = value.value;
    }

    changeCategorie(value:any){
      // console.log("this is the value of Categorie : " + value.value)
      this.categorie = value.value;
    }

    isNotEmail(email: string): boolean {
      const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      console.log(!pattern.test(email));
      return !pattern.test(email);
    }

    clearInputs(){
      this.error_messages_chauffeur.map((el:any) => el.display = false);
      this.error_messages_organizateur.map((el:any) => el.display = false);
      this.error_messages_global.map((el:any) => el.display = false);

    }

    showPassword(id:string){
      const input = document.getElementById(id);

      if (input?.attributes.getNamedItem('type')?.value == 'password'){
        input.setAttribute("type", "text");
        return;
      }else if(input?.attributes.getNamedItem('type')?.value == 'confirm'){
        input.setAttribute("type", "text");
        return;
      }
      input!.setAttribute("type", 'password');

    }

    saveUser(){
      console.log("is all validate ? : "+this.validation());
      if(this.validation()){
        let content = {};

        if(this.registerAs == 'chauffeur'){
          content = {
            "pseudo" : this.error_messages_chauffeur[0].input,
            "carBrind" : this.error_messages_chauffeur[1].input,
            "imageRecto" : this.error_messages_chauffeur[2].input,
            "imageVerso" : this.error_messages_chauffeur[3].input,
            "numCardPro" : this.error_messages_chauffeur[4].input,
            "categorie" : this.categorie,
            "image": this.error_messages_global[0].input.startsWith('data:image') ? this.error_messages_global[0].input : null,
            "lastname": this.error_messages_global[1].input,
            "firstname": this.error_messages_global[2].input,
            "email": this.error_messages_global[3].input,
            "emailformat": this.error_messages_global[4].input,
            "password": this.error_messages_global[5].input,
            "passwordConfirmed": this.error_messages_global[6].input,
            "passMatching": this.error_messages_global[7].input,
            "condition": this.error_messages_global[8].input,
            "role": this.registerAs,
          };
        }else if(this.registerAs == 'organisateur'){
          content = {
            "organization": this.error_messages_organizateur[0].input,
            "address": this.error_messages_organizateur[1].input,
            "image": this.error_messages_global[0].input.startsWith('data:image') ? this.error_messages_global[0].input : null,
            "lastname": this.error_messages_global[1].input,
            "firstname": this.error_messages_global[2].input,
            "email": this.error_messages_global[3].input,
            "emailformat": this.error_messages_global[4].input,
            "password": this.error_messages_global[5].input,
            "passwordConfirmed": this.error_messages_global[6].input,
            "passMatching": this.error_messages_global[7].input,
            "condition": this.error_messages_global[8].input,
            "role": this.registerAs,
          };
        }
        // console.log(JSON.parse(content));

        this.authService.$register(content).subscribe(
          data => {
            console.log("this is the result of api register : " + data);
            presentToast('votre compte a ete cree !', 'bottom', 'success');
            this.clearInputs();
            this.router.navigate(["/map"]);
          },
          err => {
            console.error("you have and exception : " + JSON.stringify(err));
            this.messageErroshow = JSON.stringify(err.error.message);
          }
        );
      }
    }


}
