using Attendance.Models.SharedProp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Attendance.Models
{
    public class User : Audit
    {
        public int Id { get; set; }
        public int? ManagerId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public decimal Salary { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime JoinDate { get; set; }
        public DateTime? LeftDate { get; set; }
        public int RoleId { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public IList<Request> Requests { get; set; }

        public User Manager { get; set; }

    }
}