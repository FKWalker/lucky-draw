import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamApiService {
  private baseUrl = environment.apiUrl; // comes from environment file

  constructor(private http: HttpClient) {}

  getAllTeamMembers(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.search) params = params.set('search', options.search);
    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    
    return this.http.get<any>(`${this.baseUrl}/team`, { params });
  }

  getTeamMemberById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/team/${id}`);
  }

  createTeamMember(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/team`, formData);
  }

  updateTeamMember(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/team/${id}`, formData);
  }

  deleteTeamMember(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/team/${id}`);
  }

}