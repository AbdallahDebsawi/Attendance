import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { Attendance } from '../models/attendance';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  role: any;
  userId?: number = 0;
  isCheckedIn: boolean = false;
  lastAttendance: Attendance | null = null;
  checkInTime?: string | null = null;

  constructor(
    private router: Router,
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
    public apiService: ServiceApiService
  ) {}

  ngOnInit(): void {
    this.setUserRole();
    this.loadLastAttendance();
  }

  setUserRole(): void {
    const loggedInEmployee = this.apiService.getLoggedInEmployee();
    if (loggedInEmployee) {
      this.role = loggedInEmployee.RoleId;
      this.userId = loggedInEmployee!.Id;
      console.log('User Role:', this.role);
    }
  }

  toggleSidebar(sidenav: any) {
    sidenav.toggle();
  }

  signOut() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form Data:', result);
      }
    });
  }

  loadLastAttendance() {
    const storedCheckIn = localStorage.getItem('checkInTime');

    if (storedCheckIn) {
      this.isCheckedIn = true;
      this.checkInTime = storedCheckIn;

      // ✅ Also store lastAttendance locally for proper check-out
      this.lastAttendance = {
        UserId: this.userId,
        CheckIn: storedCheckIn,
        CheckOut: null, // Since user is checked in, checkout is null
      };

      console.log('Restored check-in time from local storage:', storedCheckIn);
      return;
    }

    // If not found in local storage, fetch from DB
    this.attendanceService.getLastAttendanceForUser(this.userId!).subscribe(
      (data) => {
        if (data) {
          this.lastAttendance = data;
          this.isCheckedIn = data.CheckOut === null;

          if (this.isCheckedIn) {
            localStorage.setItem('checkInTime', data.CheckIn!); // ✅ Store check-in time
          }
        } else {
          this.isCheckedIn = false;
        }
        console.log('Last attendance from DB:', data);
      },
      (error) => {
        console.error('Error fetching last attendance:', error);
        this.isCheckedIn = false;
      }
    );
  }

  toggleCheckInOut() {
    if (this.isCheckedIn) {
      this.checkOut();
    } else {
      this.checkIn();
    }
  }

  checkIn() {
    const now = new Date();
    now.setHours(now.getHours() + 3); // Convert to Jordan time (UTC+3)

    const newAttendance: Attendance = {
      UserId: this.userId,
      CheckIn: now.toISOString(),
      CheckOut: null,
    };

    this.attendanceService.createAttendanceUser(newAttendance).subscribe(
      (data) => {
        this.lastAttendance = data;
        this.isCheckedIn = true;
        localStorage.setItem('checkInTime', now.toISOString());
        console.log('Checked in successfully:', data);
        this.updateAttendanceRecords();
      },
      (error) => {
        console.error('Check-in failed:', error);
      }
    );
  }

  checkOut() {
    if (!this.lastAttendance || !this.lastAttendance.CheckIn) {
      console.error('Check-out failed: No check-in record found.');
      return;
    }

    const now = new Date();
    now.setHours(now.getHours() + 3); // Convert to Jordan time (UTC+3)

    const newCheckoutRecord: Attendance = {
      UserId: this.userId,
      CheckIn: this.lastAttendance.CheckIn,
      CheckOut: now.toISOString(),
    };

    console.log('Sending check-out request:', newCheckoutRecord);

    this.attendanceService.createAttendanceUser(newCheckoutRecord).subscribe(
      (data) => {
        console.log('API Response:', data);
        if (data && data.CheckOut) {
          this.lastAttendance = null;
          this.isCheckedIn = false;
          localStorage.removeItem('checkInTime');
          console.log('Checked out successfully:', data);
          this.updateAttendanceRecords();
        } else {
          console.error('Check-out response missing CheckOut time:', data);
        }
      },
      (error) => {
        console.error('Check-out failed:', error);
      }
    );
  }
  updateAttendanceRecords() {
    this.attendanceService.getAttendanceUserById(this.userId!).subscribe({
      next: (data) => {
        this.attendanceService.updateAttendanceData(data); // ✅ Notify subscribers
      },
      error: (err) => {
        console.error('Error fetching attendance records:', err);
      },
    });
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.attendanceService
      .getUserAttendanceByMonth(this.userId!, year, month)
      .subscribe((data) => {
        this.attendanceService.updateAttendanceByMonth(data);
      });

    this.attendanceService
      .getLastAttendanceForUser(this.userId!)
      .subscribe((data) => {
        this.attendanceService.updateLastAttendance(data);
      });
  }
}
