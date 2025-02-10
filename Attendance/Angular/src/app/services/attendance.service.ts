import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from '../shared/models/attendance';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `https://localhost:44323/api/AttendanceUser`;
  // BehaviorSubject to hold current attendance data
  private attendanceDataSubject = new BehaviorSubject<Attendance | null>(null);
  currentAttendanceData = this.attendanceDataSubject.asObservable();

  constructor(private http: HttpClient) {}
  updateAttendanceData(attendance: Attendance) {
    this.attendanceDataSubject.next(attendance);
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
}
