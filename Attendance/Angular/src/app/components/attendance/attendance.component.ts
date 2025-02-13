import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [DatePipe], // Provide DatePipe
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date> | undefined;
  userId? = 12;
  name: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private apiService: ServiceApiService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get userId from the URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id; // Convert string to number
      } else {
        const loggedInEmployee = this.apiService.getLoggedInEmployee();
        this.userId = loggedInEmployee?.Id;
      }

      this.loadAttendanceRecords();
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.name = queryParams['name'] || '';
    });

    // Subscribe to changes in attendance data
    this.attendanceService.attendanceData$.subscribe((data) => {
      this.attendanceRecords = data;
    });
  }

  loadAttendanceRecords(): void {
    this.attendanceService.getAttendanceUserById(this.userId!).subscribe({
      next: (data) => {
        this.attendanceRecords = data;
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
