using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Attendance.Data
{
    public class AttendanceDb : DbContext
    {
        public AttendanceDb() : base("name=AttendanceDb")
        {

        }
    }
}