import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.css']
})
export class RequestEntryComponent {
  requestForm: FormGroup;
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apiUrl : ServiceApiService,
    public dialogRef: MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request
  ) {
    this.data = this.data || {};
    this.requestForm = this.fb.group({
      id: [data?.Id || null],
      typeOfAbsence: [data?.TypeOfAbsence, Validators.required],
      from: [data?.From, Validators.required],
      to: [data?.To, Validators.required],
      reasonOfAbsence: [data?.ReasonOfAbsence, Validators.required],
      MangarStatus : [data?.ManagerStatus || false],
      hRStatus: [data?.HRStatus || false],
      userId: [data?.UserId]
    });
  }

  saveRequest(): void {
    if (this.requestForm.valid) {
      const requestData = this.requestForm.value;
      
      if (requestData.id) {
        this.apiUrl.putData(`UpdateRequest/${requestData.id}`, requestData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.apiUrl.postData('CreateRequest', requestData).subscribe(() => {
          this.dialogRef.close(true);
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
