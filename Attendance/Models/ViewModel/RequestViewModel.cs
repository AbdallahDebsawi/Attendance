using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Attendance.Models.ViewModel
{
    public class RequestViewModel
    {
        public int Id { get; set; }
        public string TypeOfAbsence { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string ReasonOfAbsence { get; set; }
        public string Name { get; set; }
        public string ManagerStatus { get; set; }
        public string HRStatus { get; set; }
        public int UserId { get; set; }
        public User Users { get; set; }
    }
}
