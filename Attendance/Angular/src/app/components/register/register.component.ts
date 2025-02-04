import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/enums/role';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  roles = Object.values(Role)

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      salary: ['',Validators.required],
      gender :['' ,Validators.required],
      department : ['' , Validators.required],
      role: ['',Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      joinDate: ['', Validators.required],
      managerId :['',Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.Id) {
      this.userForm.patchValue(this.data);
      const formatDate = this.formatDate(this.data.joinDate);
      this.userForm.patchValue({ joinDate: formatDate });
    }
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
