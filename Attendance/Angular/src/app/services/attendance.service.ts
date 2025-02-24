import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from '../shared/models/attendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `https://oriented-s.com:90/Raqeeb/AttendanceBackend/api/AttendanceUser`;

  // BehaviorSubject to hold current attendance data
  private attendanceDataSubject = new BehaviorSubject<Attendance[]>([]);
  attendanceData$ = this.attendanceDataSubject.asObservable();

  // BehaviorSubject to hold monthly attendance data
  private attendanceMonthSubject = new BehaviorSubject<Attendance[]>([]);
  attendanceMonth$ = this.attendanceMonthSubject.asObservable();

  // BehaviorSubject to hold last attendance data
  private lastAttendanceSubject = new BehaviorSubject<Attendance | null>(null);
  lastAttendance$ = this.lastAttendanceSubject.asObservable();
  constructor(private http: HttpClient) {}

  // Method to update the attendance data
  updateAttendanceData(attendance: Attendance[]): void {
    this.attendanceDataSubject.next(attendance);
  }
  updateLastAttendance(attendance: Attendance | null): void {
    this.lastAttendanceSubject.next(attendance);
  }
  updateAttendanceByMonth(attendance: Attendance[]): void {
    this.attendanceMonthSubject.next(attendance);
  }

  createAttendanceUser(attendanceUser: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, attendanceUser);
  }

  updateAttendanceUser(
    id: number,
    attendanceUser: Attendance
  ): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, attendanceUser);
  }

  getAllAttendanceUsers(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  getAttendanceUserById(id: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/${id}`);
  }

  deleteAttendanceUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getUserAttendanceByDate(
    userId: number,
    date: string
  ): Observable<Attendance | null> {
    return this.http.get<Attendance | null>(
      `${this.apiUrl}/user/${userId}/date/${date}`
    );
  }

  getLastAttendanceForUser(userId: number): Observable<Attendance | null> {
    return this.http.get<Attendance | null>(
      `${this.apiUrl}/user/${userId}/last`
    );
  }
  getUserAttendanceByMonth(
    userId: number,
    year: number,
    month: number
  ): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(
      `${this.apiUrl}/user/${userId}/month/${year}/${month}`
    );
  }

  getMonthlyHours(userId : number): Observable<Attendance[]>{
    return this.http.get<Attendance[]>(`${this.apiUrl}/user/${userId}`);
  }
}
