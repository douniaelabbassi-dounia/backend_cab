import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from 'src/environments/environment';

export interface UserPosition {
  user_id: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private baseUrl = URL + 'queue/';
  private authorizationHeader = {
    'Authorization': '',
    'Content-Type': 'application/json'
  };

  constructor(private http: HttpClient) { }

  private initializeToken() {
    this.authorizationHeader.Authorization = `Bearer ${localStorage.getItem('apiToken')}`;
  }

  updatePosition(stationPointId: number, lat: number, lng: number): Observable<any> {
    this.initializeToken();
    const url = `${this.baseUrl}${stationPointId}/update`;
    return this.http.post(url, { lat, lng }, { headers: this.authorizationHeader });
  }

  getPositions(stationPointId: number): Observable<UserPosition[]> {
    this.initializeToken();
    const url = `${this.baseUrl}${stationPointId}/positions`;
    return this.http.get<UserPosition[]>(url, { headers: this.authorizationHeader });
  }

  leaveQueue(stationPointId: number): Observable<any> {
    this.initializeToken();
    const url = `${this.baseUrl}${stationPointId}/leave`;
    return this.http.post(url, {}, { headers: this.authorizationHeader });
  }
}