import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListPointsService {


  $UrlPoints:string = URL + 'points/all';
  $UrlMyPoints:string = URL + 'points/my';
  $UrlSavePoint:string = URL + 'points/add';
  $UrlDetailPoint:string = URL + 'points/detail';
  $UrlUpdatePoint:string = URL + 'points/update';
  $UrlUpdateLvlPoint:string = URL + 'points/lvl/update';
  $UrlDeletePoint:string = URL + 'points/delete';
  $UrlFeedbackPoint:string = URL + 'points/feedback';
  $UrlDisablePoint:string = URL + 'points/disable';
  //{"done":true,"id":553,"type":"jaune"}
  $Authorization = {
    'Authorization': '',
    'Content-Type': 'application/json'
  }

  // Simple caching mechanism
  private myPointsCache: any = null;
  private forceRefresh = false;

  $checker:boolean = true;

  $listPoint:Array<any> = [
    {
      id:1,
      reference:523,
      adresse:"64 rue de Varenne, Paris",
      type:'Cinéma',
      date:'03/04/22 à 14:15'
    }
  ];

  constructor(private http:HttpClient) { }

  $getPoints(){
    this.$inicializeToken();
    return this.http.get(this.$UrlPoints,{headers: this.$Authorization});
  }

  $getMyPoints(force: boolean = false){
    // If a refresh is forced or there's no cache, fetch from the server
    if (force || this.forceRefresh || !this.myPointsCache) {
      this.forceRefresh = false; // Reset the flag
      this.$inicializeToken();
      return this.http.get(this.$UrlMyPoints, { headers: this.$Authorization }).pipe(
        tap(data => {
          this.myPointsCache = data; // Store the new data in the cache
        })
      );
    } else {
      // Otherwise, return the cached data immediately
      return new Observable((observer: { next: (arg0: any) => void; complete: () => void; }) => {
        observer.next(this.myPointsCache);
        observer.complete();
      });
    }
  }

  $savePoint(content:any){
    this.$inicializeToken();
    this.forceRefresh = true; // Set the flag to force a refresh on the next $getMyPoints call
    return this.http.post(this.$UrlSavePoint, content, {headers: this.$Authorization});
  }

  $getPointDetails(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlDetailPoint, content, {headers: this.$Authorization});
  }

  $updatePoint(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlUpdatePoint, content, {headers: this.$Authorization});
  }

  $updateLvlPoint(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlUpdateLvlPoint, content, {headers: this.$Authorization});
  }

  $deletePoint(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlDeletePoint, content, {headers: this.$Authorization});
  }

  $feedbackPoint(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlFeedbackPoint, content, {headers: this.$Authorization});
  }

  $disablePoints(content:any){
    this.$inicializeToken();
    return this.http.post(this.$UrlDisablePoint, content, {headers: this.$Authorization});
  }

 $inicializeToken(){
    this.$Authorization.Authorization = `Bearer ${localStorage.getItem('apiToken')}`
    console.log('this is the header ' + this.$Authorization.Authorization);
  }
}