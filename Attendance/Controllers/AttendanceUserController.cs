using Attendance.Data;
using Attendance.Models;
using Attendance.Models.Interfaces;
using Attendance.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class AttendanceUserController : ApiController, IAttendance<AttendanceUser>
    {
        private AttendanceDb db = new AttendanceDb();


        [HttpGet]
        [Route("api/CreateAttendance")]
        public IHttpActionResult Create(int id, AttendanceUser model)
        {
            AttendanceUser attendanceUser = new AttendanceUser()
            {
                CheckIn = DateTime.Now,
                CheckOut = null,
                Status = model.Status,
                WorkingHours = model.WorkingHours,
                UserId = id
            };

            db.AttendanceUsers.Add(attendanceUser);
            db.SaveChanges();
            return Ok();
        }

        public IHttpActionResult Create(AttendanceUser model)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        [Route("api/AttendanceUsersDelete")]
        public IHttpActionResult Delete(int id)
        {
            var attendance = db.AttendanceUsers.Find(id);
            if (attendance != null)
            {
                db.AttendanceUsers.Remove(attendance);
                db.SaveChanges();
            }
            return NotFound();
        }

        [HttpGet]
        [Route("api/GetAllAttendance")]
        public IHttpActionResult GetAll()
        {
            List<AttendanceUserViewModel> result = new List<AttendanceUserViewModel>();
            result = db.AttendanceUsers.Select(a => new AttendanceUserViewModel
            {
                CheckIn = a.CheckIn,
                CheckOut = (DateTime)a.CheckOut,
                Status = a.Status,
                WorkingHours = a.WorkingHours,
                UserId = a.UserId
            }).ToList();
            return Ok(result);
        }


        [HttpGet]
        [Route("api/GetAttendanceById/{id}")]
        public IHttpActionResult GetById(int id)
        {
            var attendance = db.AttendanceUsers.Find(id);
            if (attendance == null)
            {
                return NotFound();
            }
            AttendanceUserViewModel result = new AttendanceUserViewModel();
            result.CheckIn = attendance.CheckIn;
            result.CheckOut = (DateTime)attendance.CheckOut;
            result.Status = attendance.Status;
            result.WorkingHours = attendance.WorkingHours;
            result.UserId = attendance.UserId;
            return Ok(result);
        }

        [HttpPut]
        [Route("api/UpdateAttendance/{id}")]
        public IHttpActionResult Update(int id, AttendanceUser model)
        {
            if (id == 0)
            {
                return NotFound();
            }

            var attendanceUser = new AttendanceUser()
            {
                Id = id,
                CheckIn = model.CheckIn,
                CheckOut = (DateTime)model.CheckOut,
                Status = model.Status,
                WorkingHours = model.WorkingHours,
                UserId = model.UserId,
                IsDeleted = model.IsDeleted,
                CreatedAt = DateTime.Now,
                CreatedBy = model.User.Name,
                ModificationDate = DateTime.Now,
            };

            db.AttendanceUsers.AddOrUpdate(attendanceUser);
            db.SaveChanges();
            return Ok();
        }
    }
}
