import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  userId?: number;
  attendanceRecords: any[] = [];
  TotalHours: number = 0;
  totalHour:number = 0;
  MinHoursPerMonth: number = 0;
  MaxHoursPerMonth: number = 0;
  TotalHoursPercentage: number = 0;

  constructor(
    private attendanceService: AttendanceService,
    private apiService: ServiceApiService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.userId = id ? +id : this.apiService.getLoggedInEmployee()?.Id;

      this.loadAttendanceRecords();
      this.loadMonthlyHours();
    });
  }

  loadMonthlyHours(): void {
    this.attendanceService.getMonthlyHours(this.userId!).subscribe({
      next: (data: any) => {
        if (data) {
          this.MinHoursPerMonth = data.MinHoursPerMonth ?? 0;
          this.MaxHoursPerMonth = data.MaxHoursPerMonth ?? 0;
          this.TotalHours = this.extractHours(data.TotalHours);
          this.totalHour = data.TotalHours;
          this.TotalHoursPercentage = this.calculatePercentage(this.TotalHours);
          this.cdRef.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching monthly hours:', err),
    });
  }

  extractHours(timeString: string): number {
    if (!timeString) return 0;
    const hoursMatch = timeString.match(/(\d+)\s*hours?/);
    const minutesMatch = timeString.match(/(\d+)\s*minutes?/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    return hours + minutes / 60;
  }

  calculatePercentage(hours: number): number {
    return (hours / 260) * 100;
  }

  loadAttendanceRecords(): void {
    this.attendanceService.getAttendanceUserById(this.userId!).subscribe({
      next: (data) => {
        this.attendanceRecords = data;
      },
      error: (err) => console.error('Error fetching attendance records:', err),
    });
  }
}
