import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.page.html',
  styleUrls: ['./password-forgotten.page.scss'],
})
export class PasswordForgottenPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  

  signUp(){
    this.router.navigate(['/sign-up'])
  }

  sendMail(){
    this.router.navigate(['/new-password'])
  }
}
