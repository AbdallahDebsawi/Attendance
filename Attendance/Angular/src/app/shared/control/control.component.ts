import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

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
  }

}
