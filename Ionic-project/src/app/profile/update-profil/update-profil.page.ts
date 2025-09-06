import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from 'src/app/utiles/component/notification';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';

@Component({
  selector: 'app-update-profil',
  templateUrl: './update-profil.page.html',
  styleUrls: ['./update-profil.page.scss'],
})
export class UpdateProfilPage implements OnInit {

  registerAs:string = "chauffeur";
  categorie:string = "van";
  currentNumberCard:string = "";
  role:string = "";

  userinfo:any = {
    firstName: '',
    lastName: '',
    email: '',
    pseudo: '',
    carBrind: '',
    categorie: '',
    numCardPro: '',
    organization: '',
    address: ''
  };
  
  error_messages_chauffeur:any = [
    /*0*/ {name: "pseudo",message:"Pseudo est Obligatoire.", display:false, input:''},
    /*1*/ {name: "brand",message:"La vehicule information est Obligatoire.", display:false, input:''},
    /*3*/ {name: "cart",message:"Numero de la cart est Obligatoire.", display:false, input:''},
    /*2*/ {name: "recto",message:"la taille d'image doit etre .", display:false, input:'1'},
    /*4*/ {name: "verso",message:"La photo verso de la cart est Obligatoire.", display:false, input:'2'},
  ];

  error_messages_organizateur:any = [
    /*0*/ {name: "organization",message:"Le nom d'établissement est Obligatoire.", display:false, input:''},
    /*1*/ {name: "address",message:"L'adresse d'établissement est Obligatoire.", display:false, input:''},
  ];

  error_messages_global = [
    /*0*/ {name: "image",message:"La taille d'image doit avoir 300px X 300px.", display:false, input:'https://media.licdn.com/dms/image/D4E03AQGM7EaPKzXbrQ/profile-displayphoto-shrink_800_800/0/1696715017288?e=1717632000&v=beta&t=BN6rQ6RK5UQ0wSkXtEeHRiDSSEa2ez6FsMHcW1NmMXA'},
    /*1*/ {name: "lastname",message:"Le nom est Obligatoire.", display:false, input:''},
    /*2*/ {name: "firstname",message:"Le prenom est Obligatoire.", display:false, input:''},
    /*3*/ {name: "email",message:"L'email est Obligatoire", display:false, input:''},
    /*4*/ {name: "emailformat",message:"veuillez entrer le format d'e-mail correct !", display:false, input:'email format'},

  ];

  error_message_password = [
    /*0*/ {name: "currentpassword",message:"Mot de passe actuel est Obligatoire.", display:false, input:''},
    /*1*/ {name: "password",message:"Mot de passe est Obligatoire.", display:false, input:''},
    /*2*/ {name: "passConfirm",message:"Mot de passe Confirmation est Obligatoire.", display:false, input:''},
    /*3*/ {name: "passMatching",message:"les mots de passe ne correspondent pas ! ", display:false, input:'mating password'},
  ];

  displayModal:any = {
    warningUpdateProffissionalInfo:false
  }

  constructor(
    private router:Router,
    private profileService:ProfilService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.profil();
  }

  changeRegisterAs(value:any){
    this.registerAs = value.value;
  }

  profil(){
    this.profileService.$profil().subscribe(
      (data:any) => {
        this.registerAs = data.role.role_name;
        this.error_messages_global[1].input = data?.lastName
        this.error_messages_global[2].input = data?.firstName;
        this.error_messages_global[3].input = data?.email;
        this.role = data?.role?.role_name;
        if(this.registerAs == 'chauffeur'){
          this.error_messages_chauffeur[0].input = data?.chauffeur?.pseudo
          this.error_messages_chauffeur[1].input = data?.chauffeur?.carBrind;
          this.error_messages_chauffeur[2].input = data?.chauffeur?.numCardPro;
          this.currentNumberCard = data?.chauffeur?.numCardPro;
          this.categorie = data?.chauffeur?.categorie;
        }else if(this.registerAs == 'organisateur'){
          this.error_messages_organizateur[0].input = data?.organisateur?.organization
          this.error_messages_organizateur[1].input = data?.organisateur?.address;
        }
        this.profileService.$userinfo = data
      },
      err => {
        console.log('error : '+ err.error.message);
      }
    );
  }

  changeCategorie(value:any){
    console.log('categorie : ' + value);
    
    this.categorie = value;
  }

  updateProfil(){ 
    if(this.validationPersonnalInfo()){
      this.updatePersonalInfo();
    }  
  }

  updateProfessionnalInfo(){
    let content = {
      "numCardPro": this.error_messages_chauffeur[2].input
    }

    this.profileService.$updateProffessionalInfo(content).subscribe(
      (data:any) => {
        console.log('api result : ' + JSON.stringify(data));
        this.showModal('warning');
        this.logout();
      },
      (err) => {
        console.log('error : ' + JSON.stringify(err));

      }
    );
  }

  updatePersonalInfo(){
    let content = {
      pseudo: this.error_messages_chauffeur[0].input,
      lastName: this.error_messages_global[1].input ,
      firstName: this.error_messages_global[2].input ,
      carBrind: this.error_messages_chauffeur[1].input,
      email: this.error_messages_global[3].input,
      categorie: this.categorie,
      role: this.role
    }

    this.profileService.$updatePrsonalInfo(content).subscribe(
      (data:any) => {
        console.log('api result : ' + JSON.stringify(data));
        this.registerAs = data.role.role_name;
        this.error_messages_global[1].input = data?.lastName
        this.error_messages_global[2].input = data?.firstName;
        this.error_messages_global[3].input = data?.email;
        this.role = data?.role?.role_name;
        if(this.registerAs == 'chauffeur'){
          this.error_messages_chauffeur[0].input = data?.chauffeur?.pseudo
          this.error_messages_chauffeur[1].input = data?.chauffeur?.carBrind;
          this.error_messages_chauffeur[2].input = data?.chauffeur?.numCardPro;
          this.currentNumberCard = data?.chauffeur?.numCardPro;
          this.categorie = data?.chauffeur?.categorie;
        }else if(this.registerAs == 'organisateur'){
          this.error_messages_organizateur[0].input = data?.organisateur?.organization
          this.error_messages_organizateur[1].input = data?.organisateur?.address;
        }
        this.profileService.$userinfo = data;
        presentToast('vos informations personnelles ont été mises à jour!', 'bottom', 'success')
      },
      (err) => {
        console.log('error : ' + JSON.stringify(err));

      }
    );
  }

  validationPersonnalInfo(){
    this.error_messages_chauffeur.map((el:any) => el.display = false);
    this.error_messages_global.map((el:any) => el.display = false);
    this.error_messages_organizateur.map((el:any) => el.display = false);
    if(this.registerAs == "chauffeur"){
     
      for(let i=0; i < this.error_messages_chauffeur.length-3; i++){
        if(this.error_messages_chauffeur[i].input == ""){
          this.error_messages_chauffeur[i].display = true;
        }
      }

    }else if(this.registerAs == 'organisateur'){
      for(let i=0; i < this.error_messages_organizateur.length; i++){
        if(this.error_messages_organizateur[i].input == ""){
          this.error_messages_organizateur[i].display = true;
        }
      }
    }

    for(let i=0; i<=this.error_messages_global.length-6;i++){
      if(i==3){
        if(this.error_messages_global[i].input != "" && this.isNotEmail(this.error_messages_global[i].input)){
          this.error_messages_global[i+1].display = true;
        }
      }
      
    }
    const allEqual = (arr:any) => arr.every((error:any) => !error.display );
    if(this.registerAs == "chauffeur"){     
      return allEqual(this.error_messages_chauffeur) && allEqual(this.error_messages_global);
    }else if(this.registerAs == 'organisateur'){
      return allEqual(this.error_messages_organizateur) && allEqual(this.error_messages_global);
    }

  }

  validationProfessionalInfo(){
    this.error_messages_chauffeur.map((el:any) => el.display = false);
    this.error_messages_global.map((el:any) => el.display = false);
    this.error_messages_organizateur.map((el:any) => el.display = false);
    
    if(this.error_messages_chauffeur[2].input == ""){
      this.error_messages_chauffeur[2].display = true;
    }else if(this.error_messages_chauffeur[2].input != "" && this.error_messages_chauffeur[2].input != this.currentNumberCard){
      this.showModal('warning');
    }
   
  }

  validationPassword(){
    this.error_messages_chauffeur.map((el:any) => el.display = false);
    this.error_messages_global.map((el:any) => el.display = false);
    this.error_messages_organizateur.map((el:any) => el.display = false);
    this.error_message_password.map((el:any) => el.display = false);
  
    for (let i = 0; i < this.error_message_password.length-1; i++) {
      if(this.error_message_password[i].input == ''){
        this.error_message_password[i].display = true
        console.log('element : '+ JSON.stringify(this.error_message_password[i]));
      }
    }

    if(this.error_message_password[1].input != this.error_message_password[2].input){
      this.error_message_password[3].display = true;
    }
      
    const allEqual = (arr:any) => arr.every((error:any) => error.input != '' );
    return allEqual( this.error_message_password);
  }

  submiteUpdatePassword(){
    if(this.validationPassword()){
      this.changePassword()
    }
  }

  changePassword(){
   
   let content = {
      password: this.error_message_password[0].input,
      newPassword: this.error_message_password[1].input  
   }

    this.profileService.$updatePassword(content).subscribe(
      (data:any) => {
        console.log('api result : ' + JSON.stringify(data));
        this.error_message_password.forEach((el:any, index) =>{
          if(index <= 2){
            el.input = '';
          }
        });
        presentToast('vos password a été mises à jour!', 'bottom', 'success')
      },
      (err) => {
        console.log('error : ' + JSON.stringify(err));
        if(err.status == 401){
          presentToast(err.error.message, 'bottom', 'danger')
        }
      }
    );
  }

  showModal(modal:string){
    switch (modal) {
      case "warning":
        this.displayModal.warningUpdateProffissionalInfo = !this.displayModal.warningUpdateProffissionalInfo
        break;
      case 'update-prof-info':
        this.updateProfessionnalInfo();
        break;
      default:
        break;
    }
  }



  isNotEmail(email: string): boolean {
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(!pattern.test(email));
    return !pattern.test(email);
  }

  back(){
    this.router.navigate(['/profil'])
  }

  logout(){
    this.profileService.$logout().subscribe(
      (date:any) =>{
        if(date.message == 'ok'){
          (window as any).user = undefined
          localStorage.setItem('apiToken', '');
          this.profileService.$friendsList = [];
          this.router.navigate(['/sign-in']);
        }
      },
      err =>  presentToast('error \n '+err.error.message, 'bottom', 'danger')
    )
  }

}
