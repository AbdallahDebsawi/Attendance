import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService {

  private apiUrl = 'https://localhost:44323/api/';

  constructor(private http: HttpClient) { }

  getAll(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endPoint}`);
  }

  postData(endPoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  putData(endPoint: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  deleteData(endPoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endPoint}`);
  }
}
