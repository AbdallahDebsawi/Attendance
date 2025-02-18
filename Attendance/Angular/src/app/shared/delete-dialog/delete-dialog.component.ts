import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/components/employees/employees.component';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { employee } from '../models/employee';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
})
export class DeleteDialogComponent implements OnInit {
  @Output() deleteUser = new EventEmitter<employee>();
  constructor(
    public dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiUrl: ServiceApiService
  ) {}
  onCloseClick(): void {
    this.dialogRef.close();
  }
  delete(): void {
    if (this.data?.Id) {
      const id = this.data.Id;
      this.deleteUser.emit(this.data);
      this.dialogRef.close(id);
    }
  }
  ngOnInit(): void {}
}
