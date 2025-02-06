import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  role: number = 3;
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() tableTitle: string = '';
  columnMapping: { [key: string]: string } = {
    name: 'Name',
    duratiom: 'Duration',
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
  };

  constructor() {}

  ngOnInit(): void {}

  takeAction(element: any): void {
    if (this.role === 3) {
      // HR role can update hrStatus
      if (element.hrStatus === 'Pending') {
        element.hrStatus = 'Approved'; // Update to 'Approved' when action is taken
      } else {
        element.hrStatus = 'Pending'; // Toggle back to 'Pending'
      }
    } else if (this.role === 1) {
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
}
