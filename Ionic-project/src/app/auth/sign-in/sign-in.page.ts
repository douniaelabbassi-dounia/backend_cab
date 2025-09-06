import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilService } from 'src/app/utiles/services/profil/profil.service';
import { presentToast } from 'src/app/utiles/component/notification';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  email:string = '';
  password:string = '';

  error_messages:any = [
    {message:"Email est Obligatoire.", display:false},
    {message:"Pssword est Obligatoire.", display:false},
    {message:"please enter the correct email format!", display:false},
  ]

  constructor(private router:Router, private authService:ProfilService) { }

  ngOnInit() {
  }

  showPassword(){
    const input = document.getElementById("passwordLogin");

    if (input?.attributes.getNamedItem('type')?.value == "password"){
      input.setAttribute("type", "text");
      return;
    }
    input!.setAttribute("type", "password");

  }

  async login (){
    this.validation();
    
    // Test network connectivity first
    console.log('🌐 Testing network connectivity...');
    try {
      const testResponse = await fetch('https://www.google.com', { mode: 'no-cors' });
      console.log('✅ Network test successful');
      
      // Test if our server is reachable
      console.log('🌐 Testing server connectivity...');
      try {
        const serverTest = await fetch('https://alik144.sg-host.com', { mode: 'no-cors' });
        console.log('✅ Server test successful');
      } catch (serverError) {
        console.error('❌ Server test failed:', serverError);
        presentToast('❌ Cannot reach server', 'bottom', 'danger');
        return;
      }
    } catch (error) {
      console.error('❌ Network test failed:', error);
      presentToast('❌ No internet connection detected', 'bottom', 'danger');
      return;
    }
    
    this.authService.$login(this.email, this.password).subscribe(
      (data:any) => {
        console.log("data " + JSON.stringify(data));

        if(data.message == 'ok'){
          localStorage.setItem('apiToken', data.token);
          if(!localStorage.getItem('onpoarding')){
            localStorage.setItem('onpoarding', '0');
            localStorage.setItem('skipPub', '0');
          }

          if(!localStorage.getItem('skipPub')){
            localStorage.setItem('skipPub', '0');
          }

          this.authService.$userinfo = data.user_info
          this.authService.$friendsList = data.user_info?.friends;
          this.email = ''
          this.password = ''
          this.router.navigate(["/gpsaccess"]);
        }else{
          presentToast('user or password incorrect', 'bottom', 'danger')
        }
      },

      err =>  {
        console.error('Login error details:', err);
        if (err.status == 403) {
          presentToast('erreur : \n ' + (err.error?.message || 'No message'), 'bottom', 'danger')
        }else if(err.status == 401){
          presentToast('user or password incorrect \n '+(err.error?.message || 'No message'), 'bottom', 'danger')
        }else{
          presentToast(`erreur depuis le serveur \nStatus: ${err.status}\nError: ${JSON.stringify(err.error)}\nMessage: ${err.message}`, 'bottom', 'danger')
        }
      })
  }

  validation(){
   this.error_messages.map((el:any) => el.display = false);

    if(this.email == ""){
      this.error_messages[0].display = true;
    }

    if(this.email != "" && this.isNotEmail(this.email)){
      this.error_messages[2].display = true;
    }

    if(this.password == ""){
      this.error_messages[1].display = true;
    }
  }

  regester(){
    this.router.navigate(["/sign-up"])
  }

  isNotEmail(email: string): boolean {
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(!pattern.test(email));
    return !pattern.test(email);
  }
}
