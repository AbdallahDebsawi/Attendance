import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employeeList = [
    {
      name: 'John Doe',
      department: 'Engineering',
      jobTitle: 'Software Engineer',
      startDate: '01-01-2023',
      gender: 'Male',
    },
    {
      name: 'Jane Smith',
      department: 'Marketing',
      jobTitle: 'Marketing Manager',
      startDate: '01-07-2022',
      gender: 'Female',
    },
    {
      name: 'Alex Johnson',
      department: 'HR',
      jobTitle: 'HR Manager',
      startDate: '01-12-2020',
      gender: 'Male',
    },
    {
      name: 'Michael Brown',
      department: 'Sales',
      jobTitle: 'Sales Executive',
      startDate: '01-05-2021',
      gender: 'Male',
    },
    {
      name: 'Emily Davis',
      department: 'Finance',
      jobTitle: 'Accountant',
      startDate: '01-08-2019',
      gender: 'Female',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
