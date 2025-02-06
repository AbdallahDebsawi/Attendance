import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employeeList: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      (data: Employee[]) => {
        console.log('Fetched data:', data); 
        this.employeeList = data;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
}
