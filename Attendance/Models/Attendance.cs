using Attendance.Models.SharedProp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Attendance.Models
{
    public class Attendance : Audit
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string Status { get; set; }
        public TimeSpan WorkingHours 
        { 
            get
            {
                return CheckOut - CheckIn;
            }
        }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}