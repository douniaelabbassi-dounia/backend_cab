import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from '../utiles/component/notification';
import { ProfilService } from '../utiles/services/profil/profil.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  notificationList:Array<any> = [
    {id: 1, name: "Non", activated: false},
    {id: 2, name: "Toutes", activated: false},
    {id: 3, name: "Niv 3 et 4", activated: false},
    {id: 4, name: "Direct", activated: false},
  ];

  selectedNotificationArray: Array<any> = [];
  visibilitySelector:string = "personne";
  ray:string = '300';
  notificationSelector:string = 'Niv 3 et 4,Direct';
  appearanceDuration:string = '15'
  seeNotePoint:number = 1 
  
  constructor(private router:Router, private profileService:ProfilService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.profil();

  }

  ionViewDidEnter(){

  }

  getNotifData(){
    console.log(this.notificationSelector);
    
    let array = this.notificationSelector.split(',');
    if (array.length > 0) {
      array.map(el => this.checkOruncheck(el))
    }
  }

  // select notification from form
  selectNotification(selectednotif:any, event:any){
    let status = event.target.checked
    if(status){
      this.checkOruncheck(selectednotif.name)
    }else{
      this.checkOruncheck(selectednotif.name)
    }
  }

  // searsh for notification 
  findNotificationElement(name:string){
    let element = this.notificationList.find(el => el.name == name)
    if(element){
      return element;
    }
    return {id:0, name:'', activated:false};
  }

   // this method for notification check / uncheck
   checkOruncheck(notificationTitle:string){
    let notificationEement = this.findNotificationElement(notificationTitle);
    if(notificationEement.id != 0){
      if(notificationEement.name != 'Non'){
        this.notificationList.find(el =>el.name == 'Non').activated = false
           
        if(!notificationEement.activated){
          if(this.notificationSelector == '' || this.notificationSelector.includes('Non')){
            this.notificationSelector = notificationEement.name
          }else if(!this.notificationSelector.includes(notificationEement.name)){
            this.notificationSelector += ',' + notificationEement.name

          }
          notificationEement.activated = true;
          // console.log(this.notificationSelector);
          
        }else if(notificationEement.activated){
          notificationEement.activated = false;
          this.rmNotification(notificationEement.name);
          // console.log(this.notificationSelector);
        }
      }else{
        this.notificationList.map(el =>el.name == 'Non'? el.activated = true:el.activated = false)
        this.notificationSelector = 'Non'
      }
      
      // console.log("----------------------------- data --------------------------\n " + this.notificationSelector);
      // console.log("switch checker is done !!!");
    }else{
      console.error("switch checker isn't done !!!, the notification Title not found (find NotificationElement Method take name not find in notificationList array! ");
    }
   }

  goTo(destination:string){
    this.router.navigate(['/map']);
  }

  // select visibility
  selectSelectorVisibilities(value:string){
    this.visibilitySelector = value;
  }

  save(){
    let content = {
      ray:this.ray,
      visibility:this.visibilitySelector,
      notification:this.notificationSelector,
      pointDuration:this.appearanceDuration,
      seeNotesPoint:true
    }

    console.log(content); 
    this.profileService.$updateSetting(content).subscribe(
      (data:any) => {
        console.log(JSON.stringify(data));
        
        if(data.status == 200){
          presentToast("the modification has been saved!","bottom","success");
        }
      },
      err => {
        console.log("error :" + err.error.message);
        presentToast("error :" + err.error.messag,"bottom","danger");
      }
    );
  }


  // drop notification categorie
  rmNotification(content:string){
    let array = this.notificationSelector.split(',');
    array.splice(array.indexOf(content),1);
    this.notificationSelector = ''
    array.map(el => this.notificationSelector += el)   
  }

  profil(){
    this.profileService.$profil().subscribe(
      (data:any) => {
        this.profileService.$userinfo = data;
        this.ray = data.ray;
        this.appearanceDuration = data.pointDuration;
        this.visibilitySelector = data.visibility;
        this.notificationSelector = data.notification;
        this.seeNotePoint = data.seeNotesPoint;
       
        console.log(JSON.stringify(this.notificationList));
        const allEqual = (arr:any) => arr.every((el:any) => !el.activated );
        
        if( allEqual(this.notificationList)){
          this.getNotifData();
        }
      },
      err => {
        console.log('error : '+ err.error.message);
      }
    );
  }

}
