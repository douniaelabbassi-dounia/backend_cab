import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  createPassword(){
    
  }

  showPassword(id:string){
    const input = document.getElementById(id);
    
    if (input?.attributes.getNamedItem('type')?.value == "password"){
      input.setAttribute("type", "text");
      return;
    }
    input!.setAttribute("type", "password");
    
  }

  signUp(){
    this.router.navigate(['/sign-up'])
  }
}
