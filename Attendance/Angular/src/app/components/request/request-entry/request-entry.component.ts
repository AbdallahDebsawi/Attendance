import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    private dialogRef : MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {
    this.requestForm = this.fb.group({
      typeOfAbsence : ['',Validators.required],
      from : ['' ,Validators.required],
      to : ['' ,Validators.required],
      reasonOfAbsence : ['' ,Validators.required],
      fileDocument : ['' ,Validators.required]

    });
   }

  ngOnInit(): void {
  }

  close(): void{
    this.dialogRef.close();
   }

   onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);
  }
}
