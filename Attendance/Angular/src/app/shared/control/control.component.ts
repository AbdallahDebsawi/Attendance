import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RequestEntryComponent } from 'src/app/components/request/request-entry/request-entry.component';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from '../models/request';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
})
export class ControlComponent implements OnInit {
  role: number = 3;
  requests : any[] =[];
  isUpdateMode : boolean = false;
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() tableTitle: string = '';
  requestForm! : FormGroup;
  @Output() editRequest = new EventEmitter<any>();
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
  };

  constructor(public dialog : MatDialog ,private apiUrl : ServiceApiService ,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.apiUrl.getAll('GetAllRequest').subscribe(
      (data : Request[]) => {
        this.requests = data;
      },
      (error) => {
        console.error('Error fetching Data');
      });
  }

  openCreateDialog(){
    const dialogRef = this.dialog.open(RequestEntryComponent , {
      data : null,
    });
  }


  openEditDialog(element: any) {
    this.isUpdateMode = true;
    this.requestForm = this.fb.group({
      typeOfAbsence: [element.typeOfAbsence],
      from: [element.from],
      to: [element.to],
      reasonOfAbsence: [element.reasonOfAbsence],
      userId: [element.userId],
      managerStatus: [element.managerStatus],
      hrStatus: [element.hrStatus],
    });
    this.dialog.open(RequestEntryComponent, {
      width: '500px',
      data: { form: this.requestForm, isUpdateMode: this.isUpdateMode },
    });
    console.log(this.isUpdateMode = this.isUpdateMode)
  }

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
