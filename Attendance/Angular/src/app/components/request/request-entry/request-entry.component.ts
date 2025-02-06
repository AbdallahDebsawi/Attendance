import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { RequestComponent } from '../request.component';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.css']
})
export class RequestEntryComponent implements OnInit {
  requestForm : FormGroup;
  fileName : string = '';

  constructor(
    private fb : FormBuilder,
    public dialog : MatDialog,
    private apiService : ServiceApiService,
    private dialogRef : MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {
    this.requestForm = this.fb.group({
      typeOfAbsence : ['',Validators.required],
      from : ['' ,Validators.required],
      to : ['' ,Validators.required],
      reasonOfAbsence : ['' ,Validators.required],
      //fileDocument : ['' ,Validators.required],
      userId : ['' , Validators.required]

    });
   }

  ngOnInit(): void {
  }

  save(): void{
    if(this.requestForm.valid){
      const request = this.requestForm.value;
      console.log('Form Data Being Sent:', request);

      if(request.Id){
        this.apiService.putData(request.Id, request).subscribe(
          (data) => {
            console.log('Book Updated' , data);
            this.dialogRef.close(data);
          },
          (error) => {
            console.error('Error Updating Book :' , error)
          }
        );
      }
      else {
        this.apiService.postData('CreateRequest',request).subscribe(
          (data) => {
            console.log('Book Created Successfully : ' , data);
            this.dialogRef.close(data);
            
          },
          (error) => {
            console.error('Error Creating Book : ' , error)
          }
        );
      }
    } else {
      console.warn('form is invalid')
    }
   }

  close(): void{
    this.dialogRef.close();
   }

   onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);
  }
}
