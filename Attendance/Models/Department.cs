﻿using Attendance.Models.SharedProp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Attendance.Models
{
    public class Department : Audit
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; }

        public IList<User> Users { get; set; }
    }
}