import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit {
  pageTitle: string = '';
  from: string = '';
  constructor(private router: Router) {}

  ngOnInit() {
    this.updateTitleBasedOnRoute();
  }

  updateTitleBasedOnRoute() {
    const currentPath = this.router.url.split('/').pop(); // Get the last part of the URL
    if (currentPath === 'request') {
      this.pageTitle = 'Dashboard / Requests';
      this.from = 'request';
    } else if (currentPath === 'employee') {
      this.pageTitle = 'Dashboard / Employees';
      this.from = 'employee';
    } else {
      this.pageTitle = 'Dashboard';
      this.from = '';
    }
  }
}
