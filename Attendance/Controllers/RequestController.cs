using Attendance.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class RequestController : ApiController
    {
        private AttendanceDb db = new AttendanceDb();
    }
}
