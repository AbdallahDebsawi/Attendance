import { Component, OnInit } from '@angular/core';
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

  constructor(private apiUrl: ServiceApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.apiUrl.getAll('GetAllRequest').subscribe(
      (data : Request[]) => {
        console.log('Fetched Data :' , data);
        this.requestList = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error Fetching Data : ', error)
      }
    )
  }

  openDialog(request?: Request): void {
    console.log('Id',request?.Id)
    const dialogRef = this.dialog.open(RequestEntryComponent, {
      width: '400px',
      data: request ? { ...request } : null,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id){
          this.updateRequest(result);
        }else {
          this.createRequest()
        }
      }
    });
  }


  createRequest(){
    this.apiUrl.postData('CreateRequest', this.requestList).subscribe(() => {
      this.loadRequests();
    });
  }
  updateRequest(request : Request) : void {
    this.apiUrl.putData(`UpdateRequest/${request.Id}`, request).subscribe(() => {
      this.loadRequests();
    });
  }

  deleteRequest(request: Request): void {
    this.apiUrl.deleteData(`RequestDelete/${request.Id}`).subscribe(
      () => {
        this.loadRequests();
      });
  }
  
  

  
}