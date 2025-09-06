import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  urlSendMail:string = URL + 'sendmail';

  $Authorization = { 
    'Authorization': '',
    'Content-Type': 'application/json'
  }

  constructor(private http:HttpClient) { }

  $sendMail(content:any){
    this.$inicializeToken();
    return this.http.post(this.urlSendMail, content, {headers: this.$Authorization})
  }

  $inicializeToken(){
    this.$Authorization.Authorization = `Bearer ${localStorage.getItem('apiToken')}`
    console.log('this is the header ' + this.$Authorization.Authorization);
  }
}
