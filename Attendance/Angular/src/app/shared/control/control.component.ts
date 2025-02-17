import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from '../models/request';
import { employee } from '../models/employee';
import { Role } from 'src/app/enums/role';

import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
enum AbsenceType {
  AnnualLeave = 1,
  SickLeave = 2,
  PersonalLeave = 3,
  Other = 4,
}

enum Status {
  Approved = 1,
  Rejected = 2,
  Pending = 3,
}
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  searchText: any;

  element: Request = {} as Request;
  isUpdateMode: boolean = false;
  isEmployeeComponent: boolean = false; // New flag to track if it's Employee component
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() tableTitle: string = '';
  @Input() searchColumn: string = '';
  @Output() createUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<any>();
  @Output() deleteUser = new EventEmitter<employee>();
  @Output() createRequest = new EventEmitter<void>();
  @Output() editRequest = new EventEmitter<any>();
  @Output() deleteRequest = new EventEmitter<Request>();
  @Input() request!: Request;
  @Output() filterClicked = new EventEmitter<void>();

  absenceTypeLabels: { [key: number]: string } = {
    [AbsenceType.AnnualLeave]: 'Annual Leave',
    [AbsenceType.SickLeave]: 'Sick Leave',
    [AbsenceType.PersonalLeave]: 'Personal Leave',
    [AbsenceType.Other]: 'Other',
  };

  typeStatus: { [key: number]: string } = {
    [Status.Approved]: 'Approved',
    [Status.Rejected]: 'Rejected',
    [Status.Pending]: 'Pending',
  };

  columnMapping: { [key: string]: string } = {
    name: 'Name',
    duration: 'Duration',
    startDate: 'Start Date',
    endDate: 'End Date',
    TypeOfAbsence: 'Type Of Absence',
    reasonl: 'Reason',
    ManagerStatus: 'ManagerStatus',
    HRStatus: 'HRStatus',
    department: 'Department',
    jobTitle: 'Job Title',
    gender: 'Gender',
    action: 'Action',
    id: 'ID',
    CheckIn: 'Check In',
    CheckOut: 'Check Out',
    Status: 'Status',
    WorkingHours: 'Working Hours',
    formattedCheckIn: 'Check In',
    formattedCheckOut: 'Check Out',
    Date: 'Date',
  };

  getAbsenceTypeLabel(value: number): string {
    // console.log('Absence Type Value:', value);
    return this.absenceTypeLabels[value] || 'Unknown';
  }

  constructor(
    public dialog: MatDialog,
    public apiUrl: ServiceApiService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.deleteRequest) {
      console.error('deleteRequest method is not passed correctly!');
    }

    this.apiUrl.setUserRole();

    this.isEmployeeComponent = this.tableTitle === 'Employee List'; // Example condition
  }

  takeAction(element: any): void {
    if (this.apiUrl.role === 3) {
      // HR role can update hrStatus
      if (element.hrStatus === 'Pending') {
        element.hrStatus = 'Approved'; // Update to 'Approved' when action is taken
      } else {
        element.hrStatus = 'Pending'; // Toggle back to 'Pending'
      }
    } else if (this.apiUrl.role === 1) {
      // Manager role can update managerStatus
      if (element.managerStatus === 'Pending') {
        element.managerStatus = 'Approved';
        element.hrStatus = '--';
      } else {
        element.managerStatus = 'Pending';
        element.hrStatus = '--';
      }
    }
  }

  onCreateRequest(): void {
    this.createRequest.emit();
  }
  onCreateUser(): void {
    this.createUser.emit();
  }

  onUpdateRequest(request: Request): void {
    if (!this.isEmployeeComponent) {
      this.editRequest.emit(request); // Only emit update if not Employee
    }
  }

  onDelete(request: Request): void {
    if (!this.isEmployeeComponent) {
      this.deleteRequest.emit(request); // Only emit delete if not Employee
    }
  }

  onUpdateUser(emp: employee): void {
    if (this.isEmployeeComponent) {
      this.editUser.emit(emp);
    }
  }

  onDeleteUser(emp: employee): void {
    if (this.isEmployeeComponent) {
      this.deleteUser.emit(emp);
    }
  }

  onFilterClick(): void {
    this.filterClicked.emit();
  }

  viewAttendanceHistory(id: number, name: string) {
    localStorage.setItem('employeeName', name);
    this.router.navigate(['/attendance', id]);
  }

  viewAttendanceOverview(id: number, name: string) {
    localStorage.setItem('employeeName', name);
    this.router.navigate(['/dashboard', id]);
  }

  isUpdateDisabled(request: Request): boolean {
    const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
    const role = loggedInEmployee?.RoleId; 
  
    if (request.ManagerStatus === 'Approved' && request.HRStatus === 'Approved') {
      return role !== 3;
    }
    return false;
  }


  roleMapping: { [key: number]: string } = {
    [Role.Manager]: 'Manager',
    [Role.Employee]: 'Employee',
    [Role.HR]: 'HR'
  };
}
