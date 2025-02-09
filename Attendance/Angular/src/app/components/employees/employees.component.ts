import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeService, Employee } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit, OnDestroy {
  employeeList: Employee[] = [];
  private employeeUpdateSub?: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    
    // Subscribe to the employeesUpdated listener
    this.employeeUpdateSub = this.employeeService.getEmployeesUpdatedListener().subscribe((updated) => {
      if (updated) {
        this.loadEmployees(); 
      }
    });
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

  ngOnDestroy() {
    if (this.employeeUpdateSub) {
      this.employeeUpdateSub.unsubscribe(); // Clean up the subscription when component is destroyed
    }
  }
}
