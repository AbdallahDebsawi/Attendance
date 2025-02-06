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
  role: any; // This will be dynamically set based on the user role
  userId: number = 8;
  attendanceId?: number | null = null;
  attendanceStatus: string = '';
  checkInTime: Date | null = null;
  checkOutTime: Date | null = null;

  constructor(
    private router: Router,
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
    private apiService: ServiceApiService  
  ) {}

  ngOnInit(): void {
    this.setUserRole();
    this.getAttendanceStatus();
  }

  // Fetch and set the user role from the service
  setUserRole(): void {
    const loggedInEmployee = this.apiService.getLoggedInEmployee();
    if (loggedInEmployee) {
      this.role = loggedInEmployee.RoleId; // Dynamically set the role
      console.log('User Role:', this.role);
    }
  }

  // Toggle the sidebar visibility
  toggleSidebar(sidenav: any) {
    sidenav.toggle();
  }

  // Sign out from the application
  signOut() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // Open the registration dialog
  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Data:', result);
      }
    });
  }

  // Handle Check In and Check Out logic
  toggleCheckInOut() {
    const currentTime = new Date();
    const todayDate = currentTime.toISOString().split('T')[0];
    console.log('todayDate', todayDate);

    if (this.role === 3) {
      console.log('HR role detected. HR-specific actions can be performed here.');
      // HR-specific actions (e.g., view or manage attendance)
      // Optionally, implement logic to allow HR to manage attendance of all employees
    }

    if (!this.checkInTime) {
      this.checkIn(currentTime, todayDate);
    } else if (this.attendanceId) {
      this.checkOut(currentTime);
    }
  }

  // Check In functionality
  checkIn(currentTime: Date, todayDate: string) {
    this.attendanceService.getUserAttendanceByDate(this.userId, todayDate).subscribe(
      (existingAttendance: Attendance | null) => {
        if (existingAttendance && existingAttendance.CheckIn) {
          console.warn('You have already checked in today.');
          alert('You have already checked in today.');
          return;
        }

        const status = currentTime.getHours() < 9 ? 'Present On Time' : 'Present Late';
        const attendanceData: Attendance = {
          UserId: this.userId,
          CheckIn: currentTime,
          Status: status,
        };

        this.attendanceService.createAttendanceUser(attendanceData).subscribe(
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
          console.log('No previous attendance record found for today. Proceeding with check-in.');
          const status = currentTime.getHours() < 9 ? 'Present On Time' : 'Present Late';
          const attendanceData: Attendance = {
            UserId: this.userId,
            CheckIn: currentTime,
            Status: status,
          };

          this.attendanceService.createAttendanceUser(attendanceData).subscribe(
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
        } else {
          console.error('Error checking previous attendance:', error);
        }
      }
    );
  }

  // Check Out functionality
  checkOut(currentTime: Date) {
    if (this.checkOutTime) {
      console.warn('You have already checked out today.');
      alert('You have already checked out today.');
      return;
    }

    const status = currentTime.getHours() < 17 ? 'Leave' : 'Present';
    const attendanceData: Attendance = {
      Id: this.attendanceId!,
      UserId: this.userId,
      CheckIn: this.checkInTime!,
      CheckOut: currentTime,
      Status: status,
    };

    this.attendanceService.updateAttendanceUser(this.attendanceId!, attendanceData).subscribe(
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

  // Fetch the attendance status on component load
  getAttendanceStatus() {
    this.attendanceService.getLastAttendanceForUser(this.userId).subscribe(
      (attendance: Attendance | null) => {
        if (attendance) {
          this.attendanceId = attendance.Id!;
          this.checkInTime = attendance.CheckIn ? new Date(attendance.CheckIn) : null;
          this.checkOutTime = attendance.CheckOut ? new Date(attendance.CheckOut) : null;

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
