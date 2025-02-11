import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeService, Employee } from 'src/app/services/employee.service';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { employee } from 'src/app/shared/models/employee';
import { ServiceApiService } from 'src/app/Service/service-api.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit, OnDestroy {
  employeeList: Employee[] = [];
  private employeeUpdateSub?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private apiUrl : ServiceApiService
  
  ) {}

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


  openDialog(emp?: employee) {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px',
      data: emp || null, // Pass employee data if editing, otherwise null
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form Data:', result);
        this.loadEmployees(); // Refresh the list after adding/updating
      }
    });
  }


    deleteUser(emp: employee): void {
      this.apiUrl.deleteData(`user/${emp.Id}`).subscribe(
        () => {
          this.loadEmployees();  // Call a method to refresh the list of users after deletion
        },
        (error) => {
          console.error('Error Deleting User', error);
        }
      );
    }

    updateUser(emp: employee): void {
      this.apiUrl.putData(`user/${emp.Id}`, emp).subscribe(
        () => {
          this.loadEmployees();  // Call a method to refresh the list of users after updating
        },
        (error) => {
          console.error('Error Updating User', error);
        }
      );
    }



  ngOnDestroy() {
    if (this.employeeUpdateSub) {
      this.employeeUpdateSub.unsubscribe(); // Clean up the subscription when component is destroyed
    }
  }



}
