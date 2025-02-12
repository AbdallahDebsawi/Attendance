import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';
import { RequestEntryComponent } from './request-entry/request-entry.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  displayedColumns: string[] = ['Id' ,'TypeOfAbsence', 'From', 'To', 'ReasonOfAbsence', 'ManagerStatus', 'HRStatus'];
  requestList: Request[] = [];
  dataSource = new MatTableDataSource<Request>();

  constructor(private apiUrl: ServiceApiService,
     private dialog: MatDialog,
     private cdRef : ChangeDetectorRef) {}

     ngOnInit(): void {
      const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
      const role = loggedInEmployee?.RoleId;
      const managerId = loggedInEmployee?.Id;
      
      if (role === 1) { 
        this.loadRequestsByManager(managerId!);
      } else {
        this.loadRequests();
      }
    }
    

  loadRequests(): void {
    const userId = this.apiUrl.getLoggedInEmployee()?.Id;

    if (userId) {
      this.apiUrl.getAll(`GetAllRequest?userId=${userId}`).subscribe(
        (data: Request[]) => {
          console.log('Fetched Data:', data);
          this.requestList = data;
          this.dataSource.data = data;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error Fetching Data:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }

  loadRequestsByManager(managerId: number): void {
    this.apiUrl.getRequestbyManager(`GetEmployeeRequestByManager?managerId=${managerId}`).subscribe(
      (data: Request[]) => {
        console.log('Fetched Requests for Manager:', data);
        this.requestList = data;
        this.dataSource.data = data;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error Fetching Data for Manager:', error);
      }
    );
  }
  

  openDialog(request?: Request): void {
    const dialogRef = this.dialog.open(RequestEntryComponent, {
      width: '800px',
      data: request ? { ...request } : null,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadRequests();
      this.cdRef.detectChanges();
    });
  }

  deleteRequest(request: Request): void {
    this.apiUrl.deleteData(`RequestDelete/${request.Id}`).subscribe(
      () => {
        this.loadRequests();
        this.cdRef.detectChanges();
      },(error) => {
        console.error('Error Deleting Request' , error);
      });
  }
}