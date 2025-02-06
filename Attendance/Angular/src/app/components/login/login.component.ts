import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { employee } from 'src/app/shared/models/employee'; 
import { ServiceApiService } from 'src/app/Service/service-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loggedInEmployee: employee = new employee();

  constructor(private apiService: ServiceApiService, private router: Router) {}

  ngOnInit(): void {}

  signIn() {
    const loginData = { email: this.email, password: this.password };

    this.apiService.postData('user/login', loginData).subscribe(
      (response: any) => {
        if (response) {
          this.loggedInEmployee = {
            Id: response.Data.Id,
            ManagerId: response.Data.ManagerId,
            Name: response.Data.Name,
            Email: response.Data.Email,
            Password: response.Data.Password,
            Gender: response.Data.Gender,
            Salary: response.Data.Salary,
            JoinDate: new Date(response.Data.JoinDate),
            RoleId: response.Data.RoleId,
            DepartmentId: response.Data.DepartmentId,
          };

          this.apiService.setLoggedInEmployee(this.loggedInEmployee);

          console.log('Logged in employee:', this.loggedInEmployee);
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        alert(error.error?.Message || 'Invalid email or password');
      }
    );
  }
}
