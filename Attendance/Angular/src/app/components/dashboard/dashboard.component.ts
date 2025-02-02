import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

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

  ngOnInit(): void {}

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
 
  chartOptions = {
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
        // yValueFormatString: "#,###.##'%'",
        // innerRadius: '65%', // Adjust the inner radius for space inside
        // indexLabel: '{name}: {y}%', // Labels on chart
        dataPoints: [
          { y: 22, name: 'Present On Time', color: '#008080' },
          { y: 5, name: 'Present Late', color: '#EF2B1F' },
          { y: 2, name: 'Absent', color: '#FF9600' },
          { y: 1, name: 'Leave', color: '#1976D2' },
        ],
      },
    ],
  };
}
