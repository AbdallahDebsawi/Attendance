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
using System.Web.Http.Description;

namespace Attendance.Controllers
{
    public class AttendanceUserController : ApiController
    {
        private AttendanceDb db = new AttendanceDb();

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
            attendanceUser.IsDeleted = false; // Ensure new records are not marked as deleted

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

            var existingAttendanceUser = await db.AttendanceUsers.Where(a => !a.IsDeleted) // Ensure we are updating only non-deleted records
                                                 .FirstOrDefaultAsync(a => a.Id == id);

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

            return Ok(existingAttendanceUser);
        }

        // GET: api/AttendanceUser
        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUsers()
        {
            // Fetch only non-deleted records
            var attendanceUsers = await db.AttendanceUsers
                                          .Where(a => !a.IsDeleted) // Exclude soft-deleted records
                                          .ToListAsync();

            return Ok(attendanceUsers);
        }

        // GET: api/AttendanceUser/{id}
        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUserById(int id)
        {
            // Fetch only non-deleted record by id
            var attendanceUser = await db.AttendanceUsers
                                         .Where(a => !a.IsDeleted) // Exclude soft-deleted records
                                         .FirstOrDefaultAsync(a => a.Id == id);

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
            var attendanceUser = await db.AttendanceUsers
                                         .Where(a => !a.IsDeleted) // Ensure we're not deleting already soft-deleted records
                                         .FirstOrDefaultAsync(a => a.Id == id);

            if (attendanceUser == null)
            {
                return NotFound();
            }

            // Perform soft delete by setting IsDeleted to true
            attendanceUser.IsDeleted = true;

            // Mark the entity as modified
            db.Entry(attendanceUser).State = EntityState.Modified;

            // Save changes to the database
            await db.SaveChangesAsync();

            return StatusCode(System.Net.HttpStatusCode.NoContent);
        }
        //  Get today's attendance record for a user
        [HttpGet]
        [Route("api/AttendanceUser/user/{userId}/date/{date}")]
        [ResponseType(typeof(AttendanceUser))]
        public async Task<IHttpActionResult> GetUserAttendanceByDate(int userId, string date)
        {
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                return BadRequest("Invalid date format.");
            }

            var attendance = await db.AttendanceUsers
                .Where(a => a.UserId == userId && DbFunctions.TruncateTime(a.CheckIn) == parsedDate.Date && !a.IsDeleted)
                .FirstOrDefaultAsync();

            if (attendance == null)
            {
                return NotFound();
            }

            return Ok(attendance);
        }

        //  Get the latest attendance record for a user
        [HttpGet]
        [Route("api/AttendanceUser/user/{userId}/last")]
        [ResponseType(typeof(AttendanceUser))]
        public async Task<IHttpActionResult> GetLastAttendanceForUser(int userId)
        {
            var latestAttendance = await db.AttendanceUsers
                .Where(a => a.UserId == userId && !a.IsDeleted)
                .OrderByDescending(a => a.CheckIn)
                .FirstOrDefaultAsync();

            if (latestAttendance == null)
            {
                return NotFound();
            }

            return Ok(latestAttendance);
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
