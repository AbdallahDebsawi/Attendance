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
  displayedColumns: string[] = ['Name' ,'TypeOfAbsence', 'From', 'To', 'ReasonOfAbsence', 'ManagerStatus', 'HRStatus'];
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
      } else if (role === 3) {
        this.loadRequestHr();
      } else {
        this.loadRequests();
      }
    }

    loadRequestsByManager(managerId: number): void {
      if (managerId) {
        this.apiUrl.getRequestbyManager(`/GetEmployeeRequestByManager?managerId=${managerId}`).subscribe(
          (data: Request[]) => {
            console.log('Fetched Requests for Manager:', data);
    
            this.requestList = this.formatRequestDates(data);
            this.dataSource.data = this.requestList;
            this.cdRef.detectChanges();
          },
          (error) => {
            console.error('Error Fetching Data for Manager:', error);
          }
        );
      } else {
        console.error('User not logged in');
      }
    }
    
    loadRequests(): void {
      const userId = this.apiUrl.getLoggedInEmployee()?.Id;
      if (userId) {
        this.apiUrl.getAll(`/GetAllRequest?userId=${userId}`).subscribe(
          (data: Request[]) => {
            console.log('Fetched Data:', data);
    
            this.requestList = this.formatRequestDates(data);
            this.dataSource.data = this.requestList;
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
    
    loadRequestHr(): void {
      this.apiUrl.getRequestByHr(`/GetAllRequestByHr`).subscribe(
        (data: Request[] | null) => {
          if (!data || !Array.isArray(data)) {
            console.error("Error: API response is invalid", data);
            return;
          }
    
          console.log("API Response:", data);
    
          this.requestList = this.formatRequestDates(data);
          this.dataSource.data = this.requestList;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error Fetching Data', error);
        }
      );
    }
    
    private formatRequestDates(data: Request[]): Request[] {
      return data.map(request => ({
          ...request,
          From: request.TypeOfAbsence == 3
              ? request.From ? new Date(request.From).toLocaleString('en-US', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit'
                }) : ''
              : request.From ? new Date(request.From).toISOString().split('T')[0] : '',
          
          To: request.TypeOfAbsence == 3  
              ? request.To ? new Date(request.To).toLocaleString('en-US', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit'
                }) : ''
              : request.To ? new Date(request.To).toISOString().split('T')[0] : '',
      }));
  }
  
  
  

  openDialog(request?: Request): void {
    const dialogRef = this.dialog.open(RequestEntryComponent, {
      width: '800px',
      data: request ? { ...request } : null,
    });
    dialogRef.afterClosed().subscribe(() => {
      const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
      const role = loggedInEmployee?.RoleId;
      const managerId = loggedInEmployee?.Id;
      if(role === 1){
        this.loadRequestsByManager(managerId!)
      }
      else if(role === 3){
      this.loadRequestHr();
      }
      else {
        this.loadRequests();
      }
      this.cdRef.detectChanges();
    });
  }

  deleteRequest(request: Request): void {
  this.apiUrl.deleteData(`RequestDelete/${request.Id}`).subscribe(
    () => {
      const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
      const role = loggedInEmployee?.RoleId;
      const managerId = loggedInEmployee?.Id;
      
      if (role === 1) {
        this.loadRequestsByManager(managerId!);
      } else if (role === 3) {
        this.loadRequestHr();
      } else {
        this.loadRequests();
      }

      this.cdRef.detectChanges();
    },
    (error) => {
      console.error('Error Deleting Request', error);
    }
  );
}

}