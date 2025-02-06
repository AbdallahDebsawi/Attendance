import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Employee {
  id: number;
  name: string;
  managerId: number;
  email: string;
  gender: string;
  salary: number;
  joinDate: string;
  roleId: number;
  departmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44323/api/user'; 

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<{ Message: string; Data: Employee[] }>(this.apiUrl).pipe(
      map(response => response.Data)
    );
  }
  
}
