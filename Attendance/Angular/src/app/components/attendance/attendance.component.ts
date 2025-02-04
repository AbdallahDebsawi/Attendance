import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [DatePipe], // Provide DatePipe
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAttendanceRecords();
  }

  loadAttendanceRecords(): void {
    this.attendanceService.getAllAttendanceUsers().subscribe({
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
        console.error('Error fetching attendance records:', err);
      },
    });
  }
}
