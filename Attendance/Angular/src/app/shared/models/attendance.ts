export class Attendance {
  Id?: number;
  UserId?: number;
  CheckIn?: Date | null ; // Allow null here
  CheckOut?: Date | null; // Allow null here
  WorkingHours?: number;
  Status?: string;
}
