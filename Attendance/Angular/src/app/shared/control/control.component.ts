import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from '../models/request';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  element: Request = {} as Request;
  isUpdateMode: boolean = false;
  isEmployeeComponent: boolean = false;  // New flag to track if it's Employee component
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() tableTitle: string = '';
  @Output() createUser = new EventEmitter<void>();
  @Output() createRequest = new EventEmitter<void>();
  @Output() editRequest = new EventEmitter<any>();
  @Output() deleteRequest = new EventEmitter<Request>();
  @Input() request!: Request;
  @Output() filterClicked = new EventEmitter<void>();

  columnMapping: { [key: string]: string } = {
    name: 'Name',
    duration: 'Duration',
    startDate: 'Start Date',
    endDate: 'End Date',
    type: 'Type',
    reasonl: 'Reason',
    managerStatus: 'Manager Status',
    hrStatus: 'HR Status',
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

  constructor(public dialog: MatDialog, public apiUrl: ServiceApiService) {}

  ngOnInit(): void {
    if (!this.deleteRequest) {
      console.error('deleteRequest method is not passed correctly!');
    }

    this.apiUrl.setUserRole();


    // Set the flag based on the role or component title
    this.isEmployeeComponent = this.tableTitle === 'Employee List';  // Example condition
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
  onCreateUser() : void {
    this.createUser.emit();
  }

  onUpdateRequest(request: Request): void {
    if (!this.isEmployeeComponent) {
      this.editRequest.emit(request);  // Only emit update if not Employee
    }
  }

  onDelete(request: Request): void {
    if (!this.isEmployeeComponent) {
      this.deleteRequest.emit(request);  // Only emit delete if not Employee
    }
  }

  onFilterClick(): void {
    this.filterClicked.emit();
  }



  
  
}
