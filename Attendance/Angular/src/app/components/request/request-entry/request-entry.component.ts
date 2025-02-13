import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';
import { MatTableDataSource } from '@angular/material/table';

enum AbsenceType {
  AnnualLeave = 1,
  SickLeave = 2,
  PersonalLeave = 3,
  Other = 4,
}

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.css'],
})
export class RequestEntryComponent implements OnInit {
  requestList: Request[] = [];
  dataSource = new MatTableDataSource<Request>();
  requestForm: FormGroup;
  absenceTypes = [
    { value: AbsenceType.AnnualLeave, label: 'Annual Leave' },
    { value: AbsenceType.SickLeave, label: 'Sick Leave' },
    { value: AbsenceType.PersonalLeave, label: 'Personal Leave' },
    { value: AbsenceType.Other, label: 'Other' },
  ];
  fileName: string = '';
  selectedFile: File | null = null;
  isManager: boolean = false;
  isHr: boolean = false;
  isEmployee: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private apiUrl: ServiceApiService,
    public dialogRef: MatDialogRef<RequestEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request
  ) {
    const loggedInEmployee = this.apiUrl.getLoggedInEmployee();
    const roleId = loggedInEmployee?.RoleId;

    this.isManager = roleId === 1;
    this.isHr = roleId === 3;
    this.isEmployee = roleId === 2;

    console.log('Is Manager', this.isManager);
    console.log('Is Hr', this.isHr);
    console.log('Is Employee', this.isEmployee);
    this.data = this.data || {};

    this.requestForm = this.fb.group({
      id: [this.data?.Id || null],
      typeOfAbsence: [
        {
          value: this.data?.TypeOfAbsence,
          disabled: this.data?.Id ? this.isManager || this.isHr : false,
        },
        Validators.required,
      ],

      from: [
        {
          value: this.formatDate(this.data?.From),
          disabled: this.data?.Id ? this.isManager || this.isHr : false,
        },
        Validators.required,
      ],

      to: [
        {
          value: this.formatDate(this.data?.To),
          disabled: this.data?.Id ? this.isManager || this.isHr : false,
        },
        Validators.required,
      ],

      reasonOfAbsence: [
        {
          value: this.data?.ReasonOfAbsence,
          disabled: this.data?.Id ? this.isManager || this.isHr : false,
        },
        Validators.required,
      ],

      managerStatus: [
        {
          value: this.data?.ManagerStatus || 'Pending',
          disabled: this.data?.Id ? !this.isManager : false,
        },
      ],

      hrStatus: [
        {
          value: this.data?.HRStatus || 'Pending',
          disabled: this.data?.Id ? !this.isHr : false,
        },
      ],
      name: [
        {
          value: this.data?.Name || 'Unknown',
          disabled: !!this.data?.Id, // Disable only if updating (Id exists)
        },
      ],
      userId: [loggedInEmployee?.Id || null],
    });

    if (!this.data?.Id) {
      this.requestForm.removeControl('name'); // Hide on create
    } else {
      this.requestForm.get('name')?.disable(); // Make readonly on update
    }
  }
  today: Date = new Date();
  minToDate: Date | null = null;

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
  }

  onStartDateChange() {
    const startDate = this.requestForm.get('from')?.value;
    this.minToDate = startDate ? new Date(startDate) : null;

    // Clear End Date when Start Date changes
    this.requestForm.get('to')?.setValue(null);
  }
  formatDate(date: any): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }

  dateRangeValidator(formGroup: FormGroup) {
    const from = formGroup.get('from')?.value;
    const to = formGroup.get('to')?.value;

    return from && to && new Date(from) > new Date(to)
      ? { invalidDateRange: true }
      : null;
  }

  saveRequest(): void {
    if (this.requestForm.valid) {
      const requestData = { ...this.requestForm.getRawValue() };

      if (requestData.id) {
        requestData.name = this.data?.Name;
        requestData.userId = this.data?.UserId;
        this.apiUrl
          .putData(`UpdateRequest/${requestData.id}`, requestData)
          .subscribe(() => {
            this.dialogRef.close(true);
            this.cdRef.detectChanges();
          });
      } else {
        this.apiUrl.postData('CreateRequest', requestData).subscribe(() => {
          this.dialogRef.close(true);
          this.cdRef.detectChanges();
        });
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.requestForm.patchValue({ fileDocument: file });
    }
  }
}
