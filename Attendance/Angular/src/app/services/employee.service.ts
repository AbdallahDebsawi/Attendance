import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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
  departmentName: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44323/api/user';
  private employeesUpdated = new BehaviorSubject<boolean>(false); // Notify when employees should be refreshed

  constructor(private http: HttpClient) {}

  // Fetch all employees
  getAllEmployees(): Observable<Employee[]> {
    return this.http
      .get<{ Message: string; Data: Employee[] }>(this.apiUrl)
      .pipe(map((response) => response.Data));
  }

  // Get the employee update notification listener
  getEmployeesUpdatedListener(): Observable<boolean> {
    return this.employeesUpdated.asObservable();
  }

  // Call this method to notify that employee data needs to be updated
  notifyEmployeesUpdated() {
    this.employeesUpdated.next(true);
  }
}
