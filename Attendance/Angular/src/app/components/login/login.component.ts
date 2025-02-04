import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  signIn() {
    const loginData = {
      email: this.email,
      password: this.password
    };
  
    this.http.post('https://localhost:44323/api/user/login', loginData).subscribe(
      (response: any) => {
        if (response) {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        alert(error.error?.Message || 'Invalid email or password');
      }
    );
  }
}
