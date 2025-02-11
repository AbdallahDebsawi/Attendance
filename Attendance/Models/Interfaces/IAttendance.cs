using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Attendance.Models.Interfaces
{
    internal interface IAttendance<T>
    {
        IHttpActionResult Create(T model);
        IHttpActionResult Delete(int id);
        IHttpActionResult GetAll(int id);
        IHttpActionResult GetById(int id);
        IHttpActionResult Update(int id, T model);
    }
}
