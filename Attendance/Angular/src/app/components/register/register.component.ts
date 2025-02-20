import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/enums/role';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { EmployeeService } from 'src/app/services/employee.service'; // Import EmployeeService
import { Gender } from 'src/app/enums/gender';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;

  
  roles = Object.entries(Role)
    .filter(([key, value]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value }));



  genders = Object.entries(Gender)
    .filter(([key, value]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value }));
   

  departments: any[] = []; // Store department list
  managers: any[] = []; // Store manager list

  // Inject EmployeeService into the constructor
  constructor(
    private fb: FormBuilder,
    private apiService: ServiceApiService,
    private employeeService: EmployeeService, // Inject EmployeeService
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      id: [''],
      CreatedBy :[''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      salary: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      joinDate: ['', Validators.required],
      managerId: [''],
      managerName: ['']
    }, {
      validator: this.passwordMatchValidator('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    console.log("Roles:", this.roles);
    console.log("Genders", this.genders);
    console.log("Departments:", this.departments);
    console.log("Managers:", this.managers);
    
    this.getDepartments();
    this.getManagers();
    
    console.log("Data passed to dialog:", this.data);

    
    if (this.data?.Id) {
     
      this.userForm.patchValue({
        id: this.data.Id,
        firstName: this.data.Name.split(' ')[0], 
        lastName: this.data.Name.split(' ')[1] || '',
        email: this.data.Email,
        password: this.data.Password || '', 
        confirmPassword: this.data.Password,
        salary: this.data.Salary,
        gender: this.data.Gender,
        department: this.data.DepartmentId || '',
        role: this.data.RoleId,
        joinDate: this.formatDate(this.data.JoinDate),
        managerName: this.data.ManagerName || '',
        managerId: this.data.managerId || ''
      });

      console.log("Form after patching values:", this.userForm.value);
    }
    else
    {
      this.userForm.patchValue({
        CreatedBy:this.apiService.loggedInEmployee?.Name
      });

     
      console.log("Form after patching values:", this.apiService.loggedInEmployee?.Name);
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
      delete formValues.firstName;
      delete formValues.lastName;
      delete formValues.confirmPassword;
      
      
    
      formValues.departmentId = formValues.department;
      delete formValues.department;

      formValues.roleId = Number(formValues.role);
      delete formValues.role;

      formValues.managerId = Number(formValues.managerId);

      if (formValues.managerId === 0) {
        formValues.managerId = null;
      }
      

      if (this.data?.Id) {  // If Id exists, update the user
        this.apiService.putData(`user/${this.data.Id}`, formValues).subscribe(
          (response) => {
            console.log('User updated successfully:', response);
            this.dialogRef.close(formValues);
            this.employeeService.notifyEmployeesUpdated();
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      } else {  // Otherwise, create a new user
        this.apiService.postData('user/register', formValues).subscribe(
          (response) => {
            console.log('User registered successfully:', response);
            this.dialogRef.close(formValues);
            this.employeeService.notifyEmployeesUpdated();
          },
          (error) => {
            console.error('Error registering user:', error);
          }
        );
      }
    }
  }
}
