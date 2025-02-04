using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Attendance.Models.ViewModel
{
    public class RequestViewModel
    {
        public string TypeOfAbsence { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string ReasonOfAbsence { get; set; }
        public bool MangerStatus { get; set; }
        public bool HRStatus { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
