import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Request } from 'src/app/shared/models/request';
import { MatTableDataSource } from '@angular/material/table';
import { Status } from 'src/app/enums/status';

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
  status = [
    { value: Status.Pending, label: 'Pending' },
    { value: Status.Approved, label: 'Approved' },
    { value: Status.Rejected, label: 'Rejected' },
  ];
  fileName: string = '';
  selectedFile: File | null = null;
  isManager = false;
  isHr = false;
  isEmployee = false;

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

    console.log('Is Manager:', this.isManager);
    console.log('Is HR:', this.isHr);
    console.log('Is Employee:', this.isEmployee);

    this.data = this.data || {};

    this.requestForm = this.fb.group({
      id: [this.data?.Id || null],
      typeOfAbsence: [
        {
          value:
            this.absenceTypes[
              this.data?.TypeOfAbsence ? this.data?.TypeOfAbsence - 1 : 0
            ].value || '',
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
          value: this.data?.ReasonOfAbsence || '',
          disabled: this.data?.Id ? this.isManager || this.isHr : false,
        },
        Validators.required,
      ],

      managerStatus: [
        {
          value: this.data?.ManagerStatus
            ? Number(this.data.ManagerStatus)
            : Status.Pending,
          disabled: this.data?.Id ? !this.isManager : false,
        },
      ],

      hrStatus: [
        {
          value: this.data?.HRStatus
            ? Number(this.data.HRStatus)
            : Status.Pending,
          disabled: this.data?.Id ? !this.isHr : false,
        },
      ],
      name: [
        {
          value: this.data?.Name || 'Unknown',
          disabled: !!this.data?.Id,
        },
      ],

      userId: [loggedInEmployee?.Id || null],
    });

    if (!this.data?.Id) {
      this.requestForm.removeControl('name'); // Hide on create
    }
  }

  today: Date = new Date();
  minToDate: Date | null = null;

  ngOnInit(): void {
    console.log('Request type:', this.absenceTypes[0].value);
    // this.requestForm = this.fb.group({
    //   from: ['', Validators.required],
    //   to: ['', Validators.required],
    // });
  }

  onStartDateChange() {
    const startDate = this.requestForm.get('from')?.value;
    this.minToDate = startDate ? new Date(startDate) : null;

    // Clear End Date when Start Date changes
    this.requestForm.get('to')?.setValue(null);
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? null
      : parsedDate.toISOString().split('T')[0];
  }

  dateRangeValidator(formGroup: FormGroup) {
    const from = formGroup.get('from')?.value;
    const to = formGroup.get('to')?.value;

    return from && to && new Date(from) > new Date(to)
      ? { invalidDateRange: true }
      : null;
  }

  saveRequest(): void {
    if (this.requestForm.invalid) {
      return;
    }

    let requestData = { ...this.requestForm.getRawValue() };

    

    if (this.data?.Id) {
      requestData.name = this.data.Name;
      requestData.userId = this.data.UserId;
    }

    const apiCall = requestData.id
      ? this.apiUrl.putData(`UpdateRequest/${requestData.id}`, requestData)
      : this.apiUrl.postData('CreateRequest', requestData);

    apiCall.subscribe(
      (response) => {
        console.log('Request saved successfully:', response);
        this.dialogRef.close(response);
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error saving request:', error);
        alert('Failed to save request. Please try again.');
      }
    );
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
