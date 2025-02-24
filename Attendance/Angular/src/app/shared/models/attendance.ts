export class Attendance {
  Id?: number;
  UserId?: number;
  CheckIn?: string | null; // Allow null here
  CheckOut?: string | null; // Allow null here
  Date?: string| null; // Allow null here
  WorkingHours?: number;
  Status?: string;
  TotalHours? : Number;
}
