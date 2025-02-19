using System;

namespace Attendance.Models.ViewModel
{
    class DayRecords
    {
        public string Date { get; set; }
        public double TotalWorkingHours { get; set; }

    }
    class Records
    {
        public string Date { get; set; }
        public string CheckIn { get; set; }
        public string CheckOut { get; set; }
        public string Status { get; set; }
        public TimeSpan WorkingHours { get; set; }


    }
}