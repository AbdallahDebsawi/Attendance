using Attendance.Data;
using Attendance.Models;
using Attendance.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class RoleController : ApiController , IAttendance<Role>
    {
        private AttendanceDb db = new AttendanceDb();

        public IHttpActionResult Create(Role model)
        {
            throw new NotImplementedException();
        }

        public IHttpActionResult Delete(int id)
        {
            throw new NotImplementedException();
        }

        public IHttpActionResult GetAll()
        {
            throw new NotImplementedException();
        }

        public IHttpActionResult GetById(int id)
        {
            throw new NotImplementedException();
        }

        public IHttpActionResult Update(int id, Role model)
        {
            throw new NotImplementedException();
        }
    }
}
