using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Attendance.Models.ViewModel
{
    public class AttendanceUserViewModel
    {
        public DateTime CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; }
        public TimeSpan WorkingHours { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
