import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from 'src/app/utiles/component/notification';
import { FeedbackService } from 'src/app/utiles/services/feedback/feedback.service';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';
import { SuperiseurEmail } from 'src/environments/environment';

@Component({
  selector: 'app-aide',
  templateUrl: './aide.page.html',
  styleUrls: ['./aide.page.scss'],
})
export class AidePage implements OnInit {

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

  sendMail(){
    console.log(this.user);
    
    if(this.validation()){
      

      let content = {
        sender: SuperiseurEmail,
        subject: "Aide email depuis : "+ this.user.email,
        content: this.content
      }
      

      this.mailsender.$sendMail(content).subscribe(
        data => {
          console.log('result of send email');
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

  back() {
    this.router.navigate(["/faq"])
  }
}
