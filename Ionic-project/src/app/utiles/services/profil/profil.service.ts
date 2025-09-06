import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NoteAmis } from 'src/app/utiles/interface/note-amis';
import { URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  UrlLogin:string = URL + 'login';
  UrlLogout:string = URL + 'logout';
  UrlRegister:string = URL + 'register';
  UrlProfile:string = URL + 'profile';
  UrlFriends:string = URL + 'friends';
  UrlInvite:string = URL + 'friends/invitation';
  UrlUnfollow:string = URL + 'friends/unfollow/';
  UrlUnfollowList:string = URL + 'friends/share';
  UrlUpdateProfInfo:string = URL + 'profile/professional_info/update';
  UrlUpdatePersoInfo:string = URL + 'profile/perosonal_info/update';
  UrlUpdateSetting:string = URL + 'profile/setting/update';
  UrlUpassword:string = URL + 'profile/password/update';
  UrlUpload:string = URL + 'upload';

  // $Authorization = {
  //   'Authorization': ``,
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*'
  // }

  $friendsList:Array<any> = [];
  $userinfo!:any;

  constructor(private http:HttpClient) { }


    token = localStorage.getItem('apiToken');
   $Authorization = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
  }


  $login(email:string, password:string): Observable<any> {
    this.$inicializeToken();
    console.log('🔐 Login attempt:', {
      email,
      loginUrl: this.UrlLogin,
      URL_BASE: URL,
      windowLocation: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname
    });
    return this.http.post(this.UrlLogin, {email,password}).pipe(
      tap((response: any) => {
        if (response && response.token) {
          console.log('Token received:', response.token);
          localStorage.setItem('apiToken', response.token);
          this.$inicializeToken(); // Re-initialize headers with the new token
        } else {
          console.error('Login response did not include a token.');
        }
      })
    );
  }

  $profil(){
    this.$inicializeToken();
    return this.http.get(this.UrlProfile,{headers: this.$Authorization});
  }

  $updateProffessionalInfo(content:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUpdateProfInfo, content,{headers: this.$Authorization});
  }

  $updatePrsonalInfo(content:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUpdatePersoInfo, content,{headers: this.$Authorization});
  }

  $updatePassword(content:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUpassword, content,{headers: this.$Authorization});
  }

  $updateSetting(content:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUpdateSetting, content, {headers: this.$Authorization});
  }

  $logout(){
    this.$inicializeToken()
    localStorage.setItem('hasRedirected', 'false');
    return this.http.get(this.UrlLogout, {headers: this.$Authorization});
  }

  $register(data:any){
    return this.http.post(this.UrlRegister, data).pipe(
      tap((response: any) => {
        if (response && response.token) {
          console.log('Token received from registration:', response.token);
          localStorage.setItem('apiToken', response.token);
          this.$inicializeToken(); // Re-initialize headers with the new token
        } else {
          console.error('Register response did not include a token.');
        }
      })
    );
  }

  $inviteFriend(content:string){
    this.$inicializeToken();
    return this.http.post(this.UrlInvite, content, {headers:this.$Authorization});
  }

  $unfollow(id:number){
    this.$inicializeToken();
    return this.http.post(this.UrlUnfollow+id, null,{headers:this.$Authorization});
  }

  $friends(){
    this.$inicializeToken();
    return this.http.get(this.UrlFriends,{headers:this.$Authorization});
  }

  $shareNoteswith(friendList:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUnfollowList, friendList, {headers:this.$Authorization});
  }

  $uploadImage(content:any){
    this.$inicializeToken();
    return this.http.post(this.UrlUpload, content, {headers: this.$Authorization});
  }

  $inicializeToken(){
    this.$Authorization.Authorization = `Bearer ${localStorage.getItem('apiToken')}`
    console.log('this is the header ' + this.$Authorization.Authorization);
  }
}
