import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceApiService } from 'src/app/Service/service-api.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/shared/models/attendance';
import { Request } from 'src/app/shared/models/request';
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
  name: string = '';
  requestList: Request[] = [];
  chartOptions = {};
  constructor(
    private attendanceService: AttendanceService,
    private apiService: ServiceApiService,
    private route: ActivatedRoute,
    private apiUrl: ServiceApiService
  ) {}

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
      type: 'Annual Leave',
      totalDays: 14,
      takenDays: 5,
      get filledPercentage(): number {
        return (this.takenDays / this.totalDays) * 100;
      },
    },
    {
      type: 'Personal Leave',
      totalDays: 14,
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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id; // Convert string to number
      } else {
        const loggedInEmployee = this.apiService.getLoggedInEmployee();
        this.userId = loggedInEmployee!.Id;
      }

      const loggedInEmployee = this.apiService.getLoggedInEmployee();
      if (this.userId === loggedInEmployee?.Id) {
        this.name = '';
        // localStorage.removeItem('employeeName');
      } else {
        this.name = localStorage.getItem('employeeName') || '';
      }

      this.loadLastAttendance();
      this.loadMonthAttendance();
      this.loadRequests();
    });

    // Subscribe to last attendance updates
    this.attendanceService.lastAttendance$.subscribe((lastAttendance) => {
      if (lastAttendance) {
        this.attendance = lastAttendance;
      }
    });

    // Subscribe to monthly attendance updates
    this.attendanceService.attendanceMonth$.subscribe((monthlyData) => {
      if (monthlyData.length > 0) {
        this.attendanceData = monthlyData;
        this.updateChartOptions();
      }
    });

    this.todayDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  }
  loadMonthAttendance(): void {
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1;

    this.attendanceService
      .getUserAttendanceByMonth(this.userId!, year, month)
      .subscribe((data) => {
        this.attendanceData = data;
        this.updateChartOptions();
        setTimeout(() => {
          this.updateChartOptions();
          // this.chartOptions = { ...this.chartOptions }; // Force UI update
        }, 100);
      });
  }
  loadLastAttendance(): void {
    this.attendanceService
      .getLastAttendanceForUser(this.userId!)
      .subscribe((data) => {
        this.attendance = data;
      });
  }
  loadRequests(): void {
    if (this.userId) {
      this.apiUrl.getAll(`GetAllRequest?userId=${this.userId}`).subscribe(
        (data: any[]) => {
          console.log('Fetched Requests:', data);

          // Convert raw API response to Request[]
          this.requestList = data.map(
            (item) =>
              new Request(
                item.Id,
                item.TypeOfAbsence,
                item.From ? new Date(item.From) : undefined,
                item.To ? new Date(item.To) : undefined,
                item.ReasonOfAbsence,
                item.ManagerStatus,
                item.HRStatus,
                item.UserId,
                item.FilePath
              )
          );

          // Reset takenDays for all leave types
          this.leaveTypes.forEach((leave) => (leave.takenDays = 0));

          // Update takenDays based on API response
          this.requestList.forEach((request) => {
            const leaveType = this.leaveTypes.find(
              (leave) => leave.type === String(request.TypeOfAbsence)
            );

            if (leaveType) {
              leaveType.takenDays += this.calculateLeaveDays(
                request.From ? request.From.toISOString().split('T')[0] : '', // Convert Date to 'YYYY-MM-DD'
                request.To ? request.To.toISOString().split('T')[0] : '' // Convert Date to 'YYYY-MM-DD'
              );
            }
          });

          // Force UI update (Angular change detection)
          this.leaveTypes = [...this.leaveTypes];
        },
        (error) => {
          console.error('Error Fetching Data:', error);
        }
      );
    } else {
      console.error('User not logged in');
    }
  }

  calculateLeaveDays(from: string, to: string): number {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return Math.max(
      1,
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24) + 1
    );
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
  updateChartOptions(): void {
    const attendanceCounts = {
      'Present On Time': 0,
      'Present Late': 0,
      Absent: 0,
      Leave: 0,
    };

    this.attendanceData.forEach((record) => {
      const status = record.Status?.trim() || 'Unknown';
      if (status in attendanceCounts) {
        attendanceCounts[status as keyof typeof attendanceCounts]++;
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
