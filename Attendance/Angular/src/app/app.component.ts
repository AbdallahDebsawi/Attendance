import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular';

  constructor(private dialog: MatDialog) {}

  openRegister() {
    const dialog = this.dialog.open(RegisterComponent,{
      width :'800px',
    });
  }
}
