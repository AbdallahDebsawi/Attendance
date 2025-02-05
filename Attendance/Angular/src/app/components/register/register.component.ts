import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/enums/role';
import { ServiceApiService } from 'src/app/Service/service-api.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  roles = Object.keys(Role).filter(key => isNaN(Number(key))) as (keyof typeof Role)[];  
  Role = Role; // Allow template access to enum values
  
  departments: any[] = []; // Store department list
  managers: any[] = []; // Store manager list

  constructor(
    private fb: FormBuilder,
    private apiService: ServiceApiService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      salary: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      joinDate: ['', Validators.required],
      managerId: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    console.log("roles:", this.roles);
    
    // Fetch Departments and Managers
    this.getDepartments();
    this.getManagers();

    // If updating user data, prefill the form
    if (this.data && this.data.Id) {
      this.userForm.patchValue(this.data);
      this.userForm.patchValue({ joinDate: this.formatDate(this.data.joinDate) });
    }
  }

  getDepartments() {
    this.apiService.getAll('department/GetAllDepartments').subscribe(
      (response: any) => {
        if (response.Data) {
          this.departments = response.Data;
        }
      },
      (error: any) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  getManagers() {
    this.apiService.getAll('user/GetManagers').subscribe(
      (response: any) => {
        if (response.Data) {
          this.managers = response.Data;
        }
      },
      (error: any) => {
        console.error('Error fetching managers:', error);
      }
    );
  }

  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  // Custom Validator to check if passwords match
  passwordMatchValidator(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.get(passwordKey);
      const confirmPassword = formGroup.get(confirmPasswordKey);
      if (confirmPassword?.errors && !confirmPassword.errors['passwordMismatch']) {
        return;
      }
      if (password?.value !== confirmPassword?.value) {
        confirmPassword?.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword?.setErrors(null);
      }
    };
  }

  save() {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;
  
      formValues.name = `${formValues.firstName} ${formValues.lastName}`;
      
      delete formValues.confirmPassword;
  
      // Map department to DepartmentId
      formValues.departmentId = formValues.department;
      delete formValues.department; // Remove the department field from the request
  
      // Call API to register the user
      this.apiService.postData('user/register', formValues).subscribe(
        (response) => {
          console.log('User registered successfully:', response);
          this.dialogRef.close(formValues); // Close the dialog with the form data
        },
        (error) => {
          console.error('Error registering user:', error);
        }
      );
    }
  }
}
