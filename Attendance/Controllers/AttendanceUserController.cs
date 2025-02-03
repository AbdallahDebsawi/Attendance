using Attendance.Data;
using Attendance.Models;
using Attendance.Models.Interfaces;
using Attendance.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class AttendanceUserController : ApiController
    {
        //private readonly AttendanceDb _context;
        private AttendanceDb db = new AttendanceDb();

        //public AttendanceUserController(AttendanceDb context)
        //{
        //    _context = context;
        //}
        // POST: api/AttendanceUser
        [HttpPost]
        public async Task<IHttpActionResult> PostAttendanceUser([FromBody] AttendanceUser attendanceUser)
        {
            if (attendanceUser == null)
            {
                return BadRequest("Invalid attendance data.");
            }

            // Ensure CheckOut and WorkingHours are nullable during creation
            attendanceUser.CheckOut = null;
            attendanceUser.WorkingHours = null;

            // Check if the User exists before adding attendance
            var userExists = await db.Users.AnyAsync(u => u.Id == attendanceUser.UserId);
            if (!userExists)
            {
                return NotFound();
            }

            db.AttendanceUsers.Add(attendanceUser);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = attendanceUser.Id }, attendanceUser);
        }

        // PUT: api/AttendanceUser/{id}
        [HttpPut]
        public async Task<IHttpActionResult> PutAttendanceUser(int id, [FromBody] AttendanceUser attendanceUser)
        {
            if (attendanceUser == null)
            {
                return BadRequest("Invalid attendance data.");
            }

            var existingAttendanceUser = await db.AttendanceUsers.FindAsync(id);

            if (existingAttendanceUser == null)
            {
                return NotFound();
            }

            // Update only the fields that are provided
            if (attendanceUser.CheckIn != default(DateTime))
            {
                existingAttendanceUser.CheckIn = attendanceUser.CheckIn;
            }

            if (attendanceUser.CheckOut.HasValue)
            {
                existingAttendanceUser.CheckOut = attendanceUser.CheckOut;
            }

            if (attendanceUser.WorkingHours.HasValue)
            {
                existingAttendanceUser.WorkingHours = attendanceUser.WorkingHours;
            }

            if (!string.IsNullOrEmpty(attendanceUser.Status))
            {
                existingAttendanceUser.Status = attendanceUser.Status;
            }

            db.Entry(existingAttendanceUser).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return StatusCode(System.Net.HttpStatusCode.NoContent);
        }

        // GET: api/AttendanceUser
        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUsers()
        {
            var attendanceUsers = await db.AttendanceUsers.ToListAsync();
            return Ok(attendanceUsers);
        }

        // GET: api/AttendanceUser/{id}
        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUserById(int id)
        {
            var attendanceUser = await db.AttendanceUsers.FindAsync(id);

            if (attendanceUser == null)
            {
                return NotFound();
            }

            return Ok(attendanceUser);
        }

        // DELETE: api/AttendanceUser/{id}
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteAttendanceUser(int id)
        {
            var attendanceUser = await db.AttendanceUsers.FindAsync(id);

            if (attendanceUser == null)
            {
                return NotFound();
            }

            db.AttendanceUsers.Remove(attendanceUser);
            await db.SaveChangesAsync();

            return StatusCode(System.Net.HttpStatusCode.NoContent);
        }

        //   private AttendanceDb db = new AttendanceDb();


        //    [HttpPost]
        //    [Route("api/CreateAttendance")]
        //    public IHttpActionResult Create(int id, AttendanceUser model)
        //    {
        //        AttendanceUser attendanceUser = new AttendanceUser()
        //        {
        //            CheckIn = DateTime.Now,
        //            CheckOut = null,
        //            Status = model.Status,
        //            WorkingHours = model.WorkingHours,
        //            UserId = id
        //        };

        //        db.AttendanceUsers.Add(attendanceUser);
        //        db.SaveChanges();
        //        return Ok();
        //    }


        //    [HttpDelete]
        //    [Route("api/AttendanceUsersDelete")]
        //    public IHttpActionResult Delete(int id)
        //    {
        //        var attendance = db.AttendanceUsers.Find(id);
        //        if (attendance != null)
        //        {
        //            db.AttendanceUsers.Remove(attendance);
        //            db.SaveChanges();
        //        }
        //        return NotFound();
        //    }

        //    [HttpGet]
        //    [Route("api/GetAllAttendance")]
        //    public IHttpActionResult GetAll()
        //    {
        //        List<AttendanceUserViewModel> result = new List<AttendanceUserViewModel>();
        //        result = db.AttendanceUsers.Select(a => new AttendanceUserViewModel
        //        {
        //            CheckIn = a.CheckIn,
        //            CheckOut = (DateTime)a.CheckOut,
        //            Status = a.Status,
        //            WorkingHours = a.WorkingHours,
        //            UserId = a.UserId
        //        }).ToList();
        //        return Ok(result);
        //    }


        //    [HttpGet]
        //    [Route("api/GetAttendanceById/{id}")]
        //    public IHttpActionResult GetById(int id)
        //    {
        //        var attendance = db.AttendanceUsers.Find(id);
        //        if (attendance == null)
        //        {
        //            return NotFound();
        //        }
        //        AttendanceUserViewModel result = new AttendanceUserViewModel();
        //        result.CheckIn = attendance.CheckIn;
        //        result.CheckOut = (DateTime)attendance.CheckOut;
        //        result.Status = attendance.Status;
        //        result.WorkingHours = attendance.WorkingHours;
        //        result.UserId = attendance.UserId;
        //        return Ok(result);
        //    }

        //    [HttpPut]
        //    [Route("api/UpdateAttendance/{id}")]
        //    public IHttpActionResult Update(int id, AttendanceUser model)
        //    {
        //        if (id == 0)
        //        {
        //            return NotFound();
        //        }

        //        var attendanceUser = new AttendanceUser()
        //        {
        //            //Id = id,
        //            //CheckIn = model.CheckIn,
        //            CheckOut = (DateTime)model.CheckOut,
        //            //Status = model.Status,
        //            //WorkingHours = model.WorkingHours,
        //            //UserId = model.UserId,
        //            //IsDeleted = model.IsDeleted,
        //            CreatedAt = DateTime.Now,
        //            CreatedBy = model.User.Name,
        //            ModificationDate = DateTime.Now,
        //        };

        //        db.AttendanceUsers.AddOrUpdate(attendanceUser);
        //        db.SaveChanges();
        //        return Ok();
        //    }
    }
}
