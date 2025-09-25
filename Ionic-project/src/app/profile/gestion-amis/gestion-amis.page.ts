import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteAmis } from '../../utiles/interface/note-amis';
import { ProfilService } from '../../utiles/services/profil/profil.service';
import { presentToast } from 'src/app/utiles/component/notification';
import { URL_BASE } from 'src/environments/environment';

@Component({
  selector: 'app-gestion-amis',
  templateUrl: './gestion-amis.page.html',
  styleUrls: ['./gestion-amis.page.scss'],
})
export class GestionAmisPage implements OnInit {
  URL = URL_BASE; // TO USE THE URL ON TEMPLATE
  imgCacheBust = Date.now();

  friendsList:any = [];

  shareNotesWith:boolean = false;
  confirmation:boolean = false;
  selectedFriendToUnfollow:number = 0;
  friendToShareWhith:any = [];

  emailOrPseudo:string = '';
  error_messages:any = [
    {message:"Email/pseudo est Obligatoire.", display:false},
    {message:"l'utilisateur preudo n'existe pas, veuillez saisir l'email à la place.", display:false},
 
  ];

  constructor(
    private router:Router,
    private profilService:ProfilService
  ) { }

  ngOnInit() {
    this.getListFriends();
    console.log(this.friendsList);
  }

  shareNotesWithFn(){
    this.shareNotesWith = !this.shareNotesWith;
    if(!this.shareNotesWith){
      console.log('note sent to selected friends!');
      this.sendNotes(this.friendToShareWhith);
    }else{
      this.friendToShareWhith = [];
    }
  }
  
  back() {
    this.router.navigate(["/profil"])
  }

  action(action: string,id: number) {
    switch (action) {
      case 'delete-friend':
        console.log("unfollowing friend ");
        this.selectedFriendToUnfollow = id;
        this.taggleModal();
        break;

      case 'share-notes':
        console.log("sharing notes with a friend/friends ");
        this.sendNotes([id]);
        break;

      case 'stop-sharing-notes':
        console.log("unsharing notes with a friend/friends ");
        break;       

      default:
        break;
    }
  }

  inviteUser(){
    this.error_messages.map((el:any) => el.display = false)
    let request:any = {
      content: this.emailOrPseudo,
      contentType:this.isEmail(this.emailOrPseudo)?'email':'pseudo'
    }

    if(request.content != ''){
      this.profilService.$inviteFriend(request).subscribe(
        (data) => {
          this.emailOrPseudo = '';
          console.log("api result : \n" + JSON.stringify(data));
          presentToast("votre invitation a ete envoyer avec succee!", 'bottom', 'success')
        },(err) => {
          if(err.status == 404){
            this.error_messages[1].display = true;
            return;
          }
          console.log("error : " + JSON.stringify(err));
          presentToast("Il y a une souci!"+JSON.stringify(err.error.error), 'bottom', 'danger')
          }
      );
      return;
    }
    this.error_messages[0].display = true;
  }

  isEmail(email: string): boolean {
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(!pattern.test(email));
    return pattern.test(email);
  }

  unfollowFiend(){
    console.log('selected relationship : '+ this.selectedFriendToUnfollow);
    this.profilService.$unfollow(this.selectedFriendToUnfollow).subscribe(
      (data:any) =>{
        console.log('api result : ' + data);
        this.getListFriends();
        presentToast('l\'opération de désabonnement se fait avec succès', 'bottom', 'success');
      },
      err => {
        console.log("erro : " + err.error.error); 
      }
    );
    this.selectedFriendToUnfollow = 0
    console.log('changed to : '+ this.selectedFriendToUnfollow);

    this.taggleModal();
  }

  taggleModal(){
    this.confirmation = !this.confirmation
  }

  async getListFriends(){
    this.profilService.$friends().subscribe(
      async (data:any)=>{
        console.log("friensd : "+ JSON.stringify(data));
        this.friendsList = await data.friends;
        this.profilService.$friendsList = await data.friends;
        this.imgCacheBust = Date.now();
      },
      err => {
        console.log("error : " + JSON.stringify(err));
      }
    )
  }

  selectedFriends(relationshipId:number, value:any){
    let add = value.target.checked;
    if(add){
      this.friendToShareWhith.push(relationshipId);      
    }else{
      let id = this.friendToShareWhith.find((el:number) => el == relationshipId);
      this.friendToShareWhith.splice(this.friendToShareWhith.indexOf(id),1)
    }    
  }

  selectAll(value:any){
    console.log("value " + value.target.checked);
    if(value.target.checked){
      this.friendsList.forEach((el:any) => {
        let input = document.getElementById('relation-'+el.id) as HTMLInputElement
        input.checked = true;
        this.friendToShareWhith.push(el.id);
      });
      
    }else{
      this.friendsList.forEach((el:any) => {
        let input = document.getElementById('relation-'+el.id) as HTMLInputElement
        input.checked = false;
      });
      this.friendToShareWhith = [];
    }
  }
  
  sendNotes(riendList:Array<any>){
    let content = {'friends': riendList}
    this.profilService.$shareNoteswith(content).subscribe(
      (data:any) =>{
        console.log("api result : " + JSON.stringify(data));
        this.getListFriends();
      },
      err => {
        console.log('error : ' + JSON.stringify(err)); 
      }
    );
  }

  imageSrc(path?: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      const sep = path.includes('?') ? '&' : '?';
      return path + sep + 'v=' + this.imgCacheBust;
    }
    const host = this.URL.replace(/\/(api|api\/)$/, '/');
    const url = host + 'storage/' + String(path).replace(/^\/*/, '');
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'v=' + this.imgCacheBust;
  }
}
