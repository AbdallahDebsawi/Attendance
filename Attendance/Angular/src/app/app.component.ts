import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './components/register/register.component';
import { RequestEntryComponent } from './components/request/request-entry/request-entry.component';
import { RequestComponent } from './components/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular';

  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(RequestEntryComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Data:', result);
      }
    });
  }

  openRegister() {
    const dialog = this.dialog.open(RegisterComponent,{
      width :'800px',
    });
  }
}
