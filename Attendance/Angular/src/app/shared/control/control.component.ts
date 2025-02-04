import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  role: string = 'hr';
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
    if (this.role === 'hr') {
      // HR role can update hrStatus
      if (element.hrStatus === 'Pending') {
        element.hrStatus = 'Approved'; // Update to 'Approved' when action is taken
      } else {
        element.hrStatus = 'Pending'; // Toggle back to 'Pending'
      }
    } else if (this.role === 'manager') {
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

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-control',
//   templateUrl: './control.component.html',
//   styleUrls: ['./control.component.css'],
// })
// export class ControlComponent implements OnInit {
//   role: string = 'employee'; // Set this to 'employee' or 'hr' based on user role
//   displayedColumns: string[] = [
//     'name',
//     'duration',
//     'startDate',
//     'endDate',
//     'type',
//     'reason',
//     'managerStatus',
//     'hrStatus',
//   ];

//   dataSource = [
//     {
//       name: 'John Doe',
//       duration: '3 days',
//       startDate: '01-01-2025',
//       endDate: '01-04-2025',
//       type: 'sick leave',
//       reason: 'Personal',
//       managerStatus: 'Approved',
//       hrStatus: 'Pending',
//     },
//     {
//       name: 'Jane Smith',
//       duration: '6 days',
//       startDate: '15-02-2025',
//       endDate: '15-08-2025',
//       type: 'Annual Vacation',
//       reason: 'Medical',
//       managerStatus: 'Pending',
//       hrStatus: 'Approved',
//     },
//     {
//       name: 'Alex Johnson',
//       duration: '1 day',
//       startDate: '20-03-2025',
//       endDate: '20-03-2026',
//       type: 'Sick Leave',
//       reason: 'Travel',
//       managerStatus: 'Approved',
//       hrStatus: 'Pending',
//     },
//     {
//       name: 'Michael Brown',
//       duration: '2 hours',
//       startDate: '10-05-2025',
//       endDate: '10-07-2025',
//       type: 'leave ',
//       reason: 'Training',
//       managerStatus: 'Pending',
//       hrStatus: 'Approved',
//     },
//     {
//       name: 'Emily Davis',
//       duration: '5 days',
//       startDate: '05-06-2025',
//       endDate: '05-03-2026',
//       type: 'Paternity',
//       reason: 'Relocation',
//       managerStatus: 'Approved',
//       hrStatus: 'Pending',
//     },
//   ];

//   constructor() {}

//   ngOnInit(): void {
//     // Update columns based on role
//     if (this.role === 'hr') {
//       this.displayedColumns = [
//         'name',
//         'duration',
//         'startDate',
//         'endDate',
//         'type',
//         'reason',
//         'action',
//       ]; // Added 'action' for HR
//     } else if (this.role === 'employee') {
//       this.displayedColumns = [
//         'name',
//         'duration',
//         'startDate',
//         'endDate',
//         'type',
//         'reason',
//         'managerStatus',
//         'hrStatus',
//       ]; // Employee view
//     }
//   }

//   takeAction(element: any): void {
//     // Example: Toggle the hrStatus between 'Approved' and 'Rejected'
//     if (element.hrStatus === 'Pending') {
//       element.hrStatus = 'Approved'; // Update to 'Approved' when action is taken
//     } else {
//       element.hrStatus = 'Pending'; // Toggle back to 'Pending'
//     }
//     console.log('Updated HR Status for', element.name, ':', element.hrStatus);
//   }
// }
