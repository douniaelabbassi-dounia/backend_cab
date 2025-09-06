import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from 'src/app/utiles/component/notification';
import { FeedbackService } from 'src/app/utiles/services/feedback/feedback.service';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';
import { SuperiseurEmail } from 'src/environments/environment';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.page.html',
  styleUrls: ['./avis.page.scss'],
})
export class AvisPage implements OnInit {
  content:string = '';
  error_messages = {
    content: 'No content to send !', display:false
  };

  user:any = this.profilService.$userinfo
  
  constructor(
    private router:Router,
    private mailsender:FeedbackService,
    private profilService:ProfilService
  ) { }

  ngOnInit() {
  }

  goMap() {
    this.router.navigate(["/map"])
  }

  sendMail(){
    if(this.validation()){


      let content = {
        sender: SuperiseurEmail,
        subject: "Suggestions / Avis email depuis : "+ this.user.email,
        content: this.content
      }
      

      this.mailsender.$sendMail(content).subscribe(
        data => {
          presentToast('votre email a été envoyé avec succès !','bottom', 'success');
          this.content = "";
        },
        err => {
          console.error("this is a error from sending email : " + err.error.message);
        }
      )
    
    }
  }

  validation(){
    this.error_messages.display = false;
    if(this.content == ''){
      this.error_messages.display = true;
      return false;
    }
    return true;
  }
}
