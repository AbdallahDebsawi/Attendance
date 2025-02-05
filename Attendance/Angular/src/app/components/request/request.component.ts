import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';
import { RequestEntryComponent } from './request-entry/request-entry.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  pageTitle: string = '';
  from: string = '';
  requestList: Request[] = [];
  displayedColumns: string[] = [
    'TypeOfAbsence',
    'From', 
    'To', 
    'ReasonOfAbsence', 
    'MangerStatus', 
    'HRStatus'
  ];
  constructor(private apiUrl : ServiceApiService , public dialog:MatDialog) { }

  ngOnInit() {
    this.loadRequest();
    //this.updateTitleBasedOnRoute();
  }

  loadRequest(): void{
    this.apiUrl.getAll('GetAllRequest').subscribe(
      (data : Request[]) => {
        console.log('data :', data);
        this.requestList = data;
      },
      (error) => {
        console.error('Error fetching Data Request List' , error);
      }
    )
  }

  //  updateTitleBasedOnRoute() {
  //   const currentPath = this.router.url.split('/').pop(); // Get the last part of the URL
  //   if (currentPath === 'request') {
  //     this.pageTitle = 'Dashboard / Requests';
  //   this.from = 'request';
  // } else if (currentPath === 'employee') {
  //     this.pageTitle = 'Dashboard / Employees';
  //  this.from = 'employee';
  //  } else {
  // this.pageTitle = 'Dashboard';
  //     this.from = '';
  //  }
  //  }
}
