using Attendance.Models.SharedProp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Attendance.Models
{
    public class Request : Audit
    {
        public int Id { get; set; }
        public string TypeOfAbsence { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string ReasonOfAbsence { get; set; }
        public string ManagerStatus { get; set; } = "Pending";
        public string HRStatus { get; set; } = "Pending";
        public int UserId { get; set; }
        public User Users { get; set; }
    }
}