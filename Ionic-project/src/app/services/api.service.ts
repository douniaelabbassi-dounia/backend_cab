import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = URL;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('apiToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAirports(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}airports`, { headers: this.getAuthHeaders() });
  }

  updateAirport(id: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}airports/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // Participation API endpoints
  getUserParticipation(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}participation/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserPoints(userId: string, points: number, action: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}participation/${userId}/points`, {
      points,
      action,
      reason: `User action: ${action}`,
      timestamp: new Date().toISOString()
    }, {
      headers: this.getAuthHeaders()
    });
  }

  initializeUserParticipation(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}participation/${userId}/initialize`, {
      initialPoints: 40,
      createdAt: new Date().toISOString()
    }, {
      headers: this.getAuthHeaders()
    });
  }

  processDailyReduction(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}participation/${userId}/daily-reduction`, {
      timestamp: new Date().toISOString()
    }, {
      headers: this.getAuthHeaders()
    });
  }

  getParticipationHistory(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}participation/${userId}/history`, {
      headers: this.getAuthHeaders()
    });
  }
}
