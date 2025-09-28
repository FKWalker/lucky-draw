import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamApiService {

  private baseUrl = environment.apiUrl + '/team'; // comes from environment file

  constructor(private http: HttpClient) {}

  getAllTeamMembers(options: any): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params: options });
  }

  getTeamMemberById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createTeamMember(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  updateTeamMember(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteTeamMember(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

}