import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { employee } from 'src/app/shared/models/employee';

@Injectable({
  providedIn: 'root',
})
export class ServiceApiService {
  private apiUrl = 'https://localhost:44323/api';
  public loggedInEmployeeKey = 'loggedInEmployee'; // Key for localStorage
  public loggedInEmployee: employee | null = null; // Define loggedInEmployee in memory
  role: any;
  userId?: number = 0;

  constructor(private http: HttpClient) {}

  getAll(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endPoint}`);
  }

  getRequestbyManager(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${endPoint}`);
  }

  getRequestByHr(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${endPoint}`);
  }

  postData(endPoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  // Method to get the logged-in employee from localStorage and memory
  getLoggedInEmployee(): employee | null {
    if (this.loggedInEmployee) {
      return this.loggedInEmployee; // Return from memory if available
    }

    const employeeData = localStorage.getItem(this.loggedInEmployeeKey);
    if (employeeData) {
      this.loggedInEmployee = JSON.parse(employeeData); // Store in memory
      return this.loggedInEmployee;
    }
    return null;
  }

  // Method to set the logged-in employee in both memory and localStorage
  setLoggedInEmployee(employee: employee): void {
    this.loggedInEmployee = employee;
    localStorage.setItem(this.loggedInEmployeeKey, JSON.stringify(employee)); // Store in localStorage
  }

  putData(endPoint: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endPoint}`, body);
  }

  deleteData(endPoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endPoint}`);
  }

  setUserRole(): void {
    const loggedInEmployee = this.getLoggedInEmployee();
    if (loggedInEmployee) {
      this.role = loggedInEmployee.RoleId;
      this.userId = loggedInEmployee!.Id;
      console.log('User Role:', this.role);
    }
  }
}
