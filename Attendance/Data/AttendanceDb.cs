using Attendance.Models;
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
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments{ get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<AttendanceUser> AttendanceUsers { get; set; }

    }
}