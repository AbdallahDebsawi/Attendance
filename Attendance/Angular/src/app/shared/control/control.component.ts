import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  role: string = 'hr'; // Set this to 'employee' or 'hr' based on user role
  displayedColumns: string[] = ['name', 'duration', 'startDate', 'endDate', 'type', 'reason', 'managerStatus', 'hrStatus'];

  dataSource = [
    { name: 'John Doe', duration: '3 months', startDate: '01-01-2025', endDate: '01-04-2025', type: 'Full-Time', reason: 'Personal', managerStatus: 'Approved', hrStatus: 'Pending' },
    { name: 'Jane Smith', duration: '6 months', startDate: '15-02-2025', endDate: '15-08-2025', type: 'Part-Time', reason: 'Medical', managerStatus: 'Pending', hrStatus: 'Approved' },
    { name: 'Alex Johnson', duration: '1 year', startDate: '20-03-2025', endDate: '20-03-2026', type: 'Contract', reason: 'Travel', managerStatus: 'Approved', hrStatus: 'Pending' },
    { name: 'Michael Brown', duration: '2 months', startDate: '10-05-2025', endDate: '10-07-2025', type: 'Internship', reason: 'Training', managerStatus: 'Pending', hrStatus: 'Approved' },
    { name: 'Emily Davis', duration: '9 months', startDate: '05-06-2025', endDate: '05-03-2026', type: 'Full-Time', reason: 'Relocation', managerStatus: 'Approved', hrStatus: 'Pending' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Update columns based on role
    if (this.role === 'hr') {
      this.displayedColumns = ['name', 'duration', 'startDate', 'endDate', 'type', 'reason', 'action']; // Added 'action' for HR
    } else if (this.role === 'employee') {
      this.displayedColumns = ['name', 'duration', 'startDate', 'endDate', 'type', 'reason', 'managerStatus', 'hrStatus']; // Employee view
    }
  }

  takeAction(element: any): void {
    // Example: Toggle the hrStatus between 'Approved' and 'Rejected'
    if (element.hrStatus === 'Pending') {
      element.hrStatus = 'Approved';  // Update to 'Approved' when action is taken
    } else {
      element.hrStatus = 'Pending';  // Toggle back to 'Pending'
    }
    console.log('Updated HR Status for', element.name, ':', element.hrStatus);
  }
}
