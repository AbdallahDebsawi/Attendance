import { Component, Input, OnInit } from '@angular/core';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  attendance: Attendance | null = null;
  attendanceData: Attendance[] = [];
  userId?: number = 0;
  today: Date = new Date();
  todayDate: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private apiService : ServiceApiService
  ) {}

  role: string = 'hr';
  totalDays: number = 14;
  takenDays: number = 10;
  leaveType: string = '';

  leaveTypes = [
    {
      type: 'Sick Leave',
      totalDays: 14,
      takenDays: 9,
      get filledPercentage(): number {
        return (this.takenDays / this.totalDays) * 100;
      },
    },
    {
      type: 'Annual Vacation',
      totalDays: 14,
      takenDays: 5,
      get filledPercentage(): number {
        return (this.takenDays / this.totalDays) * 100;
      },
    },
    {
      type: 'Personal Leave',
      totalDays: 2,
      takenDays: 1,
      get filledPercentage(): number {
        return (this.takenDays / this.totalDays) * 100;
      },
    },
    {
      type: 'Paternity',
      totalDays: 5,
      takenDays: 3,
      get filledPercentage(): number {
        return (this.takenDays / this.totalDays) * 100;
      },
    },
  ];

  ngOnInit(): void {
    const loggedInEmployee = this.apiService.getLoggedInEmployee();
    this.userId = loggedInEmployee!.Id;
    this.attendanceService
      .getLastAttendanceForUser(this.userId!)
      .subscribe((data) => {
        this.attendance = data;
      });
    this.todayDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1; // Months are 0-based in JS

    this.attendanceService
      .getUserAttendanceByMonth(this.userId!, year, month)
      .subscribe((data) => {
        this.attendanceData = data;
        this.updateChartOptions();
      });
  }

  getProgressBarColor(type: string): string {
    switch (type) {
      case 'Sick Leave':
        return '#42A5F5';
      case 'Annual Vacation':
        return '#9D0D8C';
      case 'Personal Leave':
        return '#FAAC00';
      case 'Paternity':
        return '#008080';
      default:
        return '#4CAF50';
    }
  }

  chartOptions = {};

  updateChartOptions(): void {
    const attendanceCounts = {
      'Present On Time': 0,
      'Present Late': 0,
      Absent: 0,
      Leave: 0,
    };

    // Count occurrences of each status
    this.attendanceData.forEach((record) => {
      const status = record.Status?.trim() || 'Unknown';
      if (status in attendanceCounts) {
        attendanceCounts[status as keyof typeof attendanceCounts]++;
      } else {
        // console.warn(`Unexpected status found: ${status}`);
      }
    });

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: 'Attendance Statistics',
        fontSize: 22,
      },
      subtitles: [
        {
          text: 'Monthly',
          fontSize: 16,
        },
      ],
      data: [
        {
          type: 'doughnut',
          dataPoints: [
            {
              y: attendanceCounts['Present On Time'],
              name: 'Present On Time',
              color: '#008080',
            },
            {
              y: attendanceCounts['Present Late'],
              name: 'Present Late',
              color: '#EF2B1F',
            },
            { y: attendanceCounts['Absent'], name: 'Absent', color: '#FF9600' },
            { y: attendanceCounts['Leave'], name: 'Leave', color: '#1976D2' },
          ],
        },
      ],
    };
  }
}
