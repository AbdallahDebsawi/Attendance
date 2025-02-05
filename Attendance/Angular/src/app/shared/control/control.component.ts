import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RequestEntryComponent } from 'src/app/components/request/request-entry/request-entry.component';

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
  @Output() filterClicked = new EventEmitter<void>();

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
    formattedCheckIn: 'Check In',
    formattedCheckOut: 'Check Out',
  };

  constructor() {}

  ngOnInit(): void {
  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(RequestEntryComponent, {
  //     width: '800px',
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log('Form Data:', result);
  //     }
  //   });
  // }

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

  onFilterClick(): void {
    this.filterClicked.emit(); // Emit event to trigger the date picker opening
  }
}
