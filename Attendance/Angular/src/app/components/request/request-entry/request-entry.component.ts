import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.css']
})
export class RequestEntryComponent {
  requestList: Request[] = [];
  dataSource = new MatTableDataSource<Request>();
  requestForm: FormGroup;
  fileName: string = '';
  selectedFile: File | null = null;
  isManager : boolean = false;
  isHr : boolean = false;
  isEmployee : boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdRef : ChangeDetectorRef,
    private apiUrl : ServiceApiService,
    public dialogRef: MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request
  ) {
  const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
  const roleId = loggedInEmployee?.RoleId;

this.isManager = roleId === 1;
this.isHr = roleId === 3;
this.isEmployee = roleId === 2;

console.log('Is Manager', this.isManager);
console.log('Is Hr', this.isHr);
console.log('Is Employee', this.isEmployee);
this.data = this.data || {};

this.requestForm = this.fb.group({
  id: [this.data?.Id || null],
  typeOfAbsence: [{ 
    value: this.data?.TypeOfAbsence, 
    disabled: this.data?.Id ? (this.isManager || this.isHr) : false 
  }, Validators.required],
  
  from: [{ 
    value: this.data?.From, 
    disabled: this.data?.Id ? (this.isManager || this.isHr) : false 
  }, Validators.required],
  
  to: [{ 
    value: this.data?.To, 
    disabled: this.data?.Id ? (this.isManager || this.isHr) : false 
  }, Validators.required],
  
  reasonOfAbsence: [{ 
    value: this.data?.ReasonOfAbsence, 
    disabled: this.data?.Id ? (this.isManager || this.isHr) : false 
  }, Validators.required],
  
  managerStatus: [{ 
    value: this.data?.ManagerStatus || 'Under Review', 
    disabled: this.data?.Id ? !this.isManager : false 
  }],
  
  hrStatus: [{ 
    value: this.data?.HRStatus || 'Under Review', 
    disabled: this.data?.Id ? !this.isHr : false 
  }],
  
  userId: [loggedInEmployee?.Id || null]
});
  }

  saveRequest(): void {
    if (this.requestForm.valid) {
      const requestData = this.requestForm.value;
      
      if (requestData.id) {
        this.apiUrl.putData(`UpdateRequest/${requestData.id}`, requestData).subscribe(() => {
          this.dialogRef.close(true);
          this.cdRef.detectChanges();
        });
      } else {
        this.apiUrl.postData('CreateRequest', requestData).subscribe(() => {
          this.dialogRef.close(true);
          this.cdRef.detectChanges();
        });
      }
    }
  }
  
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.requestForm.patchValue({ fileDocument: file });
    }
  }
}
