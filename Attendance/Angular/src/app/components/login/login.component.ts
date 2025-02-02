import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {}
  createUser(): void {
    this.dialog.open(RegisterComponent);
  }
  signIn() {
    this.router.navigate(['/dashboard']);
  }
}
