import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { employee } from 'src/app/shared/models/employee'; 

@Injectable({
  providedIn: 'root',
})
export class ServiceApiService {
  private apiUrl = 'https://localhost:44323/api/';
  private loggedInEmployee: employee | null = null;  // To store the logged-in employee

  constructor(private http: HttpClient) {}

  getAll(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endPoint}`);
  }

  postData(endPoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  // Method to get the logged-in employee
  getLoggedInEmployee(): employee | null {
    return this.loggedInEmployee;
  }

  // Method to set the logged-in employee
  setLoggedInEmployee(employee: employee): void {
    this.loggedInEmployee = employee;
  }

  putData(endPoint: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  deleteData(endPoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endPoint}`);
  }
}
