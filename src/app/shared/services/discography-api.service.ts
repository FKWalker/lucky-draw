import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscographyApiService {

  private baseUrl = environment.apiUrl + '/discography'; // comes from environment file

  constructor(private http: HttpClient) {}

  getAllDiscographies(options: {
    page?: number;
    limit?: number;
    artist_id?: number;
    active?: boolean;
    release_year?: string;
    filter?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.artist_id) params = params.set('artist_id', options.artist_id);
    if (options.active) params = params.set('active', options.active);
    if (options.release_year) params = params.set('release_year', options.release_year);
    if (options.filter) params = params.set('filter', options.filter);
    if (options.search) params = params.set('search', options.search);
    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  getDiscographyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createDiscography(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  updateDiscography(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteDiscography(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
}
