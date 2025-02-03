using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Attendance.Models.SharedProp
{
    public class Audit
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime ModificationDate { get; set; } = DateTime.UtcNow;
    }
}