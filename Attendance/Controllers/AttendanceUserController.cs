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
                var attendanceRecords = await db.AttendanceUsers
                    .Where(a => a.UserId == id && !a.IsDeleted)
                    .OrderBy(a => a.CheckIn)
                    .ToListAsync();

                // Dictionary to group records by date
                var groupedRecords = attendanceRecords
                    .GroupBy(a => a.CheckIn.Date)
                    .ToDictionary(g => g.Key, g => g.ToList());

                var startDate = attendanceRecords.Min(a => a.CheckIn).Date;
                var endDate = DateTime.Today;

                var result = new List<object>();

                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    var dayRecords = groupedRecords.ContainsKey(date) ? groupedRecords[date] : new List<AttendanceUser>();
                    List<object> recordsList = new List<object>();

                    if (dayRecords.Any())
                    {
                        double totalHours = 0;
                        bool breakAdded = false;

                        for (int i = 0; i < dayRecords.Count; i++)
                        {
                            var record = dayRecords[i];

                            // Determine status
                            if (record.CheckIn.TimeOfDay < TimeSpan.FromHours(8))
                                record.Status = "Present On Time";
                            else
                                record.Status = "Present Late";

                            if (record.CheckOut.HasValue)
                            {
                                var checkOutTime = record.CheckOut.Value.TimeOfDay;
                                if (checkOutTime < TimeSpan.FromHours(17))
                                    record.Status = "Leave";
                                else if (checkOutTime <= TimeSpan.FromHours(17.5))
                                    record.Status = "Leave On Time";
                                else
                                    record.Status = "Over Time";
                            }

                            // Calculate working hours for this record
                            double hoursWorked = record.CheckOut.HasValue ?
                                (record.CheckOut.Value - record.CheckIn).TotalHours : 0;
                            totalHours += hoursWorked;

                            recordsList.Add(new
                            {
                                CheckIn = record.CheckIn.ToString("hh:mm tt"),
                                CheckOut = record.CheckOut?.ToString("hh:mm tt"),
                                Status = record.Status,
                                WorkingHours = Math.Round(hoursWorked, 2)
                            });

                            // Add break after the first work session
                            if (!breakAdded && record.CheckOut.HasValue && totalHours >= 4)
                            {
                                var breakStart = record.CheckOut.Value;
                                var breakEnd = breakStart.AddHours(1);

                                recordsList.Add(new
                                {
                                    CheckIn = breakStart.ToString("hh:mm tt"),
                                    CheckOut = breakEnd.ToString("hh:mm tt"),
                                    Status = "Break",
                                    WorkingHours = 0
                                });

                                breakAdded = true;
                            }
                        }

                        result.Add(new { date = date.ToString("yyyy-MM-dd"), records = recordsList, TotalWorkingHours = Math.Round(totalHours, 2) });
                    }
                    else
                    {
                        // No record found for this day, mark as Absent
                        result.Add(new
                        {
                            date = date.ToString("yyyy-MM-dd"),
                            records = new List<object>
                {
                    new { CheckIn = "N/A", CheckOut = "N/A", Status = "Absent", WorkingHours = 0 }
                },
                            TotalWorkingHours = 0
                        });
                    }
                }

                return Ok(result);
            
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
        [HttpGet]
        [Route("api/AttendanceUser/user/{userId}/month/{year}/{month}")]
        [ResponseType(typeof(IEnumerable<AttendanceUser>))]
        public async Task<IHttpActionResult> GetUserAttendanceByMonth(int userId, int year, int month)
        {
            if (year < 1 || month < 1 || month > 12)
            {
                return BadRequest("Invalid year or month.");
            }

            // Start and end dates (pre-calculated)
            var startDate = new DateTime(year, month, 1).Date;
            var endDate = startDate.AddMonths(1); // Corrected: EF can compare directly


            var attendanceRecords = await db.AttendanceUsers
                .Where(a => a.UserId == userId
                    && !a.IsDeleted
                    && a.CheckIn >= startDate
                    && a.CheckIn < endDate)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                return NotFound();
            }

            return Ok(attendanceRecords);
        }
        //[HttpGet]
        //public async Task<IHttpActionResult> GetAttendanceUsers(int userId)
        //{
        //    var attendanceRecords = await db.AttendanceUsers
        //        .Where(a => a.UserId == userId && !a.IsDeleted)
        //        .OrderBy(a => a.CheckIn)
        //        .ToListAsync();

        //    // Dictionary to group records by date
        //    var groupedRecords = attendanceRecords
        //        .GroupBy(a => a.CheckIn.Date)
        //        .ToDictionary(g => g.Key, g => g.ToList());

        //    var startDate = attendanceRecords.Min(a => a.CheckIn).Date;
        //    var endDate = DateTime.Today;

        //    var result = new List<object>();

        //    for (var date = startDate; date <= endDate; date = date.AddDays(1))
        //    {
        //        var dayRecords = groupedRecords.ContainsKey(date) ? groupedRecords[date] : new List<AttendanceUser>();
        //        List<object> recordsList = new List<object>();

        //        if (dayRecords.Any())
        //        {
        //            double totalHours = 0;
        //            bool breakAdded = false;

        //            for (int i = 0; i < dayRecords.Count; i++)
        //            {
        //                var record = dayRecords[i];

        //                // Determine status
        //                if (record.CheckIn.TimeOfDay < TimeSpan.FromHours(8))
        //                    record.Status = "Present On Time";
        //                else
        //                    record.Status = "Present Late";

        //                if (record.CheckOut.HasValue)
        //                {
        //                    var checkOutTime = record.CheckOut.Value.TimeOfDay;
        //                    if (checkOutTime < TimeSpan.FromHours(17))
        //                        record.Status = "Leave";
        //                    else if (checkOutTime <= TimeSpan.FromHours(17.5))
        //                        record.Status = "Leave On Time";
        //                    else
        //                        record.Status = "Over Time";
        //                }

        //                // Calculate working hours for this record
        //                double hoursWorked = record.CheckOut.HasValue ?
        //                    (record.CheckOut.Value - record.CheckIn).TotalHours : 0;
        //                totalHours += hoursWorked;

        //                recordsList.Add(new
        //                {
        //                    CheckIn = record.CheckIn.ToString("hh:mm tt"),
        //                    CheckOut = record.CheckOut?.ToString("hh:mm tt"),
        //                    Status = record.Status,
        //                    WorkingHours = Math.Round(hoursWorked, 2)
        //                });

        //                // Add break after the first work session
        //                if (!breakAdded && record.CheckOut.HasValue && totalHours >= 4)
        //                {
        //                    var breakStart = record.CheckOut.Value;
        //                    var breakEnd = breakStart.AddHours(1);

        //                    recordsList.Add(new
        //                    {
        //                        CheckIn = breakStart.ToString("hh:mm tt"),
        //                        CheckOut = breakEnd.ToString("hh:mm tt"),
        //                        Status = "Break",
        //                        WorkingHours = 0
        //                    });

        //                    breakAdded = true;
        //                }
        //            }

        //            result.Add(new { date = date.ToString("yyyy-MM-dd"), records = recordsList, TotalWorkingHours = Math.Round(totalHours, 2) });
        //        }
        //        else
        //        {
        //            // No record found for this day, mark as Absent
        //            result.Add(new
        //            {
        //                date = date.ToString("yyyy-MM-dd"),
        //                records = new List<object>
        //        {
        //            new { CheckIn = "N/A", CheckOut = "N/A", Status = "Absent", WorkingHours = 0 }
        //        },
        //                TotalWorkingHours = 0
        //            });
        //        }
        //    }

        //    return Ok(result);
        //}


        // Method to calculate total working hours in a day
        private double CalculateWorkingHours(List<AttendanceUser> records)
        {
            double totalHours = 0;
            foreach (var record in records)
            {
                if (record.CheckOut.HasValue)
                {
                    totalHours += (record.CheckOut.Value - record.CheckIn).TotalHours;
                }
            }
            return Math.Round(totalHours, 2);
        }

    }

}
