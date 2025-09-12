import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistApiService {

  private baseUrl = environment.apiUrl + '/artist'; // comes from environment file

  constructor(private http: HttpClient) {}

  getAllArtists(options: {
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
    
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  getArtistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createArtist(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  updateArtist(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteArtist(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
}
