import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  role: string = 'hr';
  @Input() from: string = '';
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  tableTitle = '';
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
  };

  constructor() {}

  ngOnInit(): void {
    this.updateViewBasedOnInput();
  }
  updateViewBasedOnInput(): void {
    if (this.from === 'request') {
      this.updateRequestView();
      this.tableTitle = 'Leave History';
    } else if (this.from === 'employee') {
      this.updateEmployeeView();
      this.tableTitle = 'Employee List';
    }
  }

  updateRequestView(): void {
    if (this.role === 'hr') {
      this.displayedColumns = [
        'name',
        'duration',
        'startDate',
        'endDate',
        'type',
        'reason',
        'managerStatus',
        'hrStatus',
        // 'action',
      ];
    } else if (this.role === 'manager') {
      this.displayedColumns = [
        'name',
        'duration',
        'startDate',
        'endDate',
        'type',
        'reason',
        'managerStatus',
        'hrStatus',
        // 'action', // Manager gets an Action column
      ];
    } else if (this.role === 'employee') {
      this.displayedColumns = [
        'name',
        'duration',
        'startDate',
        'endDate',
        'type',
        'reason',
        'managerStatus',
        'hrStatus',
      ]; // Employee view
    }

    this.dataSource = [
      {
        name: 'John Doe',
        duration: '3 days',
        startDate: '01-01-2025',
        endDate: '01-04-2025',
        type: 'sick leave',
        reason: 'Personal',
        managerStatus: 'Approved',
        hrStatus: 'Pending',
      },
      {
        name: 'Jane Smith',
        duration: '6 days',
        startDate: '15-02-2025',
        endDate: '15-08-2025',
        type: 'Annual Vacation',
        reason: 'Medical',
        managerStatus: 'Pending',
        hrStatus: 'Approved',
      },
      {
        name: 'Alex Johnson',
        duration: '1 day',
        startDate: '20-03-2025',
        endDate: '20-03-2026',
        type: 'Sick Leave',
        reason: 'Travel',
        managerStatus: 'Approved',
        hrStatus: 'Pending',
      },
      {
        name: 'Michael Brown',
        duration: '2 hours',
        startDate: '10-05-2025',
        endDate: '10-07-2025',
        type: 'leave ',
        reason: 'Training',
        managerStatus: 'Pending',
        hrStatus: 'Approved',
      },
      {
        name: 'Emily Davis',
        duration: '5 days',
        startDate: '05-06-2025',
        endDate: '05-03-2026',
        type: 'Paternity',
        reason: 'Relocation',
        managerStatus: 'Approved',
        hrStatus: 'Pending',
      },
    ];
  }

  updateEmployeeView(): void {
    this.displayedColumns = [
      'name',
      'department',
      'jobTitle',
      'startDate',
      'gender',
      // 'action', // Employee view includes action for updates
    ];

    this.dataSource = [
      {
        name: 'John Doe',
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        startDate: '01-01-2023',
        gender: 'Male',
      },
      {
        name: 'Jane Smith',
        department: 'Marketing',
        jobTitle: 'Marketing Manager',
        startDate: '01-07-2022',
        gender: 'Female',
      },
      {
        name: 'Alex Johnson',
        department: 'HR',
        jobTitle: 'HR Manager',
        startDate: '01-12-2020',
        gender: 'Male',
      },
      {
        name: 'Michael Brown',
        department: 'Sales',
        jobTitle: 'Sales Executive',
        startDate: '01-05-2021',
        gender: 'Male',
      },
      {
        name: 'Emily Davis',
        department: 'Finance',
        jobTitle: 'Accountant',
        startDate: '01-08-2019',
        gender: 'Female',
      },
    ];
  }

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
