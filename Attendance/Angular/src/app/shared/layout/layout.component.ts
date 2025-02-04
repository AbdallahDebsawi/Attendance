import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from '../models/attendance';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  role = 'employee';
  userId: number = 8;
  attendanceId?: number | null = null;
  attendanceStatus: string = '';
  checkInTime: Date | null = null;
  checkOutTime: Date | null = null;

  constructor(
    private router: Router,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.getAttendanceStatus();
  }

  toggleSidebar(sidenav: any) {
    sidenav.toggle();
  }

  signOut() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // Toggle Check-In & Check-Out
  toggleCheckInOut() {
    const currentTime = new Date();
    const todayDate = currentTime.toISOString().split('T')[0];
    console.log('todayDate', todayDate);

    if (!this.checkInTime) {
      // **Check if already checked in today**
      this.attendanceService
        .getUserAttendanceByDate(this.userId, todayDate)
        .subscribe(
          (existingAttendance: Attendance | null) => {
            if (existingAttendance && existingAttendance.CheckIn) {
              console.warn('You have already checked in today.');
              alert('You have already checked in today.');
              return;
            }

            // **Check In Process**
            const status =
              currentTime.getHours() < 9 ? 'Present On Time' : 'Present Late';

            const attendanceData: Attendance = {
              UserId: this.userId,
              CheckIn: currentTime,
              Status: status,
            };

            this.attendanceService
              .createAttendanceUser(attendanceData)
              .subscribe(
                (response) => {
                  console.log('Check-In Success:', response);
                  this.attendanceId = response.Id;
                  this.attendanceStatus = 'CheckedIn';
                  this.checkInTime = currentTime;
                  localStorage.setItem('attendanceId', response.Id!.toString());
                },
                (error) => {
                  console.error('Check-In Failed:', error);
                }
              );
          },
          (error) => {
            if (error.status === 404) {
              // No previous attendance record found (which is fine for a new check-in)
              console.log(
                'No previous attendance record found for today. Proceeding with check-in.'
              );
              // Proceed with check-in
              const status =
                currentTime.getHours() < 9 ? 'Present On Time' : 'Present Late';

              const attendanceData: Attendance = {
                UserId: this.userId,
                CheckIn: currentTime,
                Status: status,
              };

              this.attendanceService
                .createAttendanceUser(attendanceData)
                .subscribe(
                  (response) => {
                    console.log('Check-In Success:', response);
                    this.attendanceId = response.Id;
                    this.attendanceStatus = 'CheckedIn';
                    this.checkInTime = currentTime;
                    localStorage.setItem(
                      'attendanceId',
                      response.Id!.toString()
                    );
                  },
                  (error) => {
                    console.error('Check-In Failed:', error);
                  }
                );
            } else {
              console.error('Error checking previous attendance:', error);
            }
          }
        );
    } else if (this.attendanceId) {
      // **Check Out Process**
      if (this.checkOutTime) {
        console.warn('You have already checked out today.');
        alert('You have already checked out today.');
        return;
      }

      const status = currentTime.getHours() < 17 ? 'Leave' : 'Present';

      const attendanceData: Attendance = {
        Id: this.attendanceId,
        UserId: this.userId,
        CheckIn: this.checkInTime,
        CheckOut: currentTime,
        Status: status,
      };

      this.attendanceService
        .updateAttendanceUser(this.attendanceId, attendanceData)
        .subscribe(
          (response) => {
            console.log('Check-Out Success:', response);
            this.attendanceStatus = 'CheckedOut';
            this.checkOutTime = currentTime;
            localStorage.removeItem('attendanceId');
          },
          (error) => {
            console.error('Check-Out Failed:', error);
          }
        );
    }
  }

  // Fetch Last Attendance Record
  getAttendanceStatus() {
    this.attendanceService.getLastAttendanceForUser(this.userId).subscribe(
      (attendance: Attendance | null) => {
        if (attendance) {
          this.attendanceId = attendance.Id!;
          this.checkInTime = attendance.CheckIn
            ? new Date(attendance.CheckIn)
            : null;
          this.checkOutTime = attendance.CheckOut
            ? new Date(attendance.CheckOut)
            : null;

          if (this.checkOutTime) {
            this.attendanceStatus = 'CheckedOut';
            localStorage.removeItem('attendanceId');
          } else if (this.checkInTime) {
            this.attendanceStatus = 'CheckedIn';
            localStorage.setItem('attendanceId', this.attendanceId.toString());
          }
        } else {
          this.attendanceStatus = 'New';
        }
      },
      (error) => {
        if (error.status === 404) {
          this.attendanceStatus = 'New';
        } else {
          console.error('Error fetching attendance status:', error);
        }
      }
    );
  }
}
