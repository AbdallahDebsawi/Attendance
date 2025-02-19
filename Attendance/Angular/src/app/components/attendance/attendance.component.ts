import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';
import { MatDatepicker } from '@angular/material/datepicker';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  //providers: [DatePipe], // Provide DatePipe
  // providers: [provideNativeDateAdapter()],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: any[] = [];
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date> | undefined;
  userId? = 12;
  name: string = '';
  tableTitle: string = this.name
    ? this.name + '’s Attendance History'
    : 'Attendance History';

  constructor(
    private attendanceService: AttendanceService,
    private apiService: ServiceApiService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id; // Convert string to number
      } else {
        const loggedInEmployee = this.apiService.getLoggedInEmployee();
        this.userId = loggedInEmployee?.Id;
      }

      const loggedInEmployee = this.apiService.getLoggedInEmployee();
      if (this.userId === loggedInEmployee?.Id) {
        this.name = '';
        this.tableTitle = 'Attendance History';
        this.cdRef.detectChanges();
        // localStorage.removeItem('employeeName');
      } else {
        this.name = localStorage.getItem('employeeName') || '';
        this.tableTitle = this.name + '’s Attendance History';
        this.cdRef.detectChanges();
      }

      this.loadAttendanceRecords();
    });

    // Subscribe to changes in attendance data
    this.attendanceService.attendanceData$.subscribe((data) => {
      this.attendanceRecords = data.reverse();
      this.cdRef.detectChanges();
    });
  }

  loadAttendanceRecords(): void {
    this.attendanceService.getAttendanceUserById(this.userId!).subscribe({
      next: (data) => {
        this.attendanceRecords = data.reverse();
        this.cdRef.detectChanges();
        console.log('Attendance records:', this.attendanceRecords);
      },
      error: (err) => {
        console.error('Error fetching attendance records:', err);
      },
    });
  }

  getUserAttendanceByMonth(year: number, month: number): void {
    this.attendanceService
      .getUserAttendanceByMonth(this.userId!, year, month)
      .subscribe({
        next: (data) => {
          this.attendanceRecords = data;
        },
        error: (err) => {
          if ((err.status = 404)) {
            this.attendanceRecords = [];
          }
          console.error('Error fetching attendance:', err);
        },
      });
  }

  openDatePicker(): void {
    this.picker!.open(); // Opens the datepicker
  }

  chosenYearHandler(
    normalizedYear: Date,
    datepicker: MatDatepicker<Date>
  ): void {
    const year = normalizedYear.getFullYear();
    this.picker!.open();
  }

  chosenMonthHandler(
    normalizedMonth: Date,
    datepicker: MatDatepicker<Date>
  ): void {
    const year = normalizedMonth.getFullYear();
    const month = normalizedMonth.getMonth() + 1;
    this.getUserAttendanceByMonth(year, month);
    datepicker.close();
  }
}
