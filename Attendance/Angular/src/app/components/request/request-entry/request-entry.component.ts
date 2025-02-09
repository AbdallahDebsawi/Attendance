import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.css']
})
export class RequestEntryComponent implements OnInit {
  requestForm: FormGroup;
  fileName: string = '';
  selectedFile: File | null = null;
  requestId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ServiceApiService,
    private dialogRef: MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request?: Request }
  ) {
    this.requestForm = this.fb.group({
      typeOfAbsence: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      reasonOfAbsence: ['', Validators.required],
      userId: ['', Validators.required],
      managerStatus : ['' , Validators.required],
      hrStatus : ['' ,Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.request?.Id) {
      this.requestId = this.data.request.Id;

      this.requestForm.patchValue({
        typeOfAbsence: this.data.request.TypeOfAbsence,
        from: this.data.request.From,
        to: this.data.request.To,
        reasonOfAbsence: this.data.request.ReasonOfAbsence,
        userId: this.data.request.UserId,
        managerStatus : this.data.request.ManagerStatus,
        hrStatus : this.data.request.HRStatus
      });
    }
  }

  save(): void {
    if (this.requestForm.valid) {
      const request = { ...this.requestForm.value };

      console.log('Form Data Being Sent:', request);

      if (this.requestId) {
        this.apiService.putData(`request/${this.requestId}`, request).subscribe(
          (data) => {
            console.log('Request Updated:', data);
            this.dialogRef.close({ success: true , data});
          },
          (error) => {
            console.error('Error Updating Request:', error);
          }
        );
      } else {
        this.apiService.postData('CreateRequest', request).subscribe(
          (data) => {
            console.log('Request Created Successfully:', data);
            this.dialogRef.close(data);
          },
          (error) => {
            console.error('Error Creating Request:', error);
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  close(): void {
    this.dialogRef.close();
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
