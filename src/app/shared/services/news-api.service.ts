import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private baseUrl = environment.apiUrl + '/news'; // comes from environment file

  constructor(private http: HttpClient) {}

  getAllNews(options: {
    page?: number;
    limit?: number;
    active?: boolean;
    filter?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.active) params = params.set('active', options.active);;
    if (options.filter) params = params.set('filter', options.filter);
    if (options.search) params = params.set('search', options.search);
    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  getNewsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createNews(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  updateNews(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
}
