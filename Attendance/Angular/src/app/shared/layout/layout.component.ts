import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router) {}
  role = 'hr';
  ngOnInit(): void {}
  toggleSidebar(sidenav: any) {
    sidenav.toggle();
  }
  signOut() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
