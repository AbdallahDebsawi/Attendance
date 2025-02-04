import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { RequestEntryComponent } from './request-entry/request-entry.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  pageTitle: string = '';
  from: string = '';
  leaveRequests = [
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
  constructor() {}

  ngOnInit() {
  //this.updateTitleBasedOnRoute();
  }

  // updateTitleBasedOnRoute() {
  //   const currentPath = this.router.url.split('/').pop(); // Get the last part of the URL
  //   if (currentPath === 'request') {
  //     this.pageTitle = 'Dashboard / Requests';
  //     this.from = 'request';
  //   } else if (currentPath === 'employee') {
  //     this.pageTitle = 'Dashboard / Employees';
  //     this.from = 'employee';
  //   } else {
  //     this.pageTitle = 'Dashboard';
  //     this.from = '';
  //   }
  // }
}
