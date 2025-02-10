import { Component, OnInit, ViewChild } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { ServiceApiService } from 'src/app/Service/service-api.service';

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
  constructor(
    private attendanceService: AttendanceService,
    private datePipe: DatePipe,
    private apiService: ServiceApiService
  ) {}

  ngOnInit(): void {
    const loggedInEmployee = this.apiService.getLoggedInEmployee();
    this.userId = loggedInEmployee!.Id;
    this.loadAttendanceRecords();
  }

  loadAttendanceRecords(): void {
    this.attendanceService.getAttendanceUserById(this.userId!).subscribe({
      next: (data) => {
        this.attendanceRecords = data.map((record) => ({
          ...record,

          // formattedCheckIn: record.CheckIn
          //   ? this.datePipe.transform(record.CheckIn, 'dd/MM/yyyy hh:mm a')
          //   : null,
          // formattedCheckOut: record.CheckOut
          //   ? this.datePipe.transform(record.CheckOut, 'dd/MM/yyyy hh:mm a')
          //   : null,
        }));
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
          this.attendanceRecords = data.map((record) => ({
            ...record,
            // CheckIn: record.CheckIn ? new Date(record.CheckIn) : null,
            // CheckOut: record.CheckOut ? new Date(record.CheckOut) : null,
            // formattedCheckIn: record.CheckIn
            //   ? this.datePipe.transform(record.CheckIn, 'dd/MM/yyyy hh:mm a')
            //   : null,
            // formattedCheckOut: record.CheckOut
            //   ? this.datePipe.transform(record.CheckOut, 'dd/MM/yyyy hh:mm a')
            //   : null,
          }));
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
