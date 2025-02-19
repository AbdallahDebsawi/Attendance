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

        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUsers()
        {
            var attendanceUsers = await db.AttendanceUsers
                                          .Where(a => !a.IsDeleted)
                                          .OrderBy(a => a.CheckIn)
                                          .ToListAsync();

            if (!attendanceUsers.Any())
            {
                return Ok(new List<object>());
            }

            var result = ApplyStatusLogic(attendanceUsers);
            return Ok(result);
        }
        // GET: api/AttendanceUser/{id}
        [HttpGet]
        public async Task<IHttpActionResult> GetAttendanceUserById(int id)
        {
            var attendanceRecords = await db.AttendanceUsers
                .Where(a => a.UserId == id && !a.IsDeleted)
                .OrderBy(a => a.CheckIn)
                .GroupBy(a => a.CheckIn.Day)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                return Ok(new List<object>()); 
            }
            var result = new List<object>();
            foreach (var record in attendanceRecords)
            {
                List<Records> dayRecords = new List<Records>() { };
                dayRecords = ApplyStatusLogic(record.ToList()) ;
                var date = record.ToList()[0].CheckIn.ToString("yyyy-MM-dd");
               TimeSpan totalWorkingHours = new TimeSpan(0, 0, 0);
                foreach (var wh in dayRecords)
                {   

                    totalWorkingHours +=wh.WorkingHours;
                }
                string formattedHours = $"{(int)totalWorkingHours.TotalHours} hours {totalWorkingHours.Minutes} minutes";
                result.Add(new {
                    Date= date,
                    Records = dayRecords,
                    TotalWorkingHours = formattedHours
                });
            }
            //var result = ApplyStatusLogic(attendanceRecords);
            return Ok(result);
        }



        // POST: api/AttendanceUser
        [HttpPost]
        public async Task<IHttpActionResult> PostAttendanceUser([FromBody] AttendanceUser attendanceUser)
        {
            if (attendanceUser == null)
            {
                return BadRequest("Invalid attendance data.");
            }

            var newRecord = new AttendanceUser
            {
                UserId = attendanceUser.UserId,
                CheckIn = attendanceUser.CheckIn,
                CheckOut = attendanceUser.CheckOut,  // Check-out is null at check-in
                IsDeleted = false
            };

            db.AttendanceUsers.Add(newRecord);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = newRecord.Id }, newRecord);
        }

        // PUT: api/AttendanceUser/{id}
        [HttpPut]
        public async Task<IHttpActionResult> PutAttendanceUser(int id, [FromBody] AttendanceUser attendanceUser)
        {
            if (attendanceUser == null || !attendanceUser.CheckOut.HasValue)
            {
                return BadRequest("Invalid check-out data.");
            }

            var existingRecord = await db.AttendanceUsers
                .Where(a => a.Id == id && !a.IsDeleted)
                .FirstOrDefaultAsync();

            if (existingRecord == null)
            {
                return NotFound();
            }

            existingRecord.CheckOut = attendanceUser.CheckOut;

            db.Entry(existingRecord).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok(existingRecord);
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

            var attendanceRecords = await db.AttendanceUsers
                .Where(a => a.UserId == userId && DbFunctions.TruncateTime(a.CheckIn) == parsedDate.Date && !a.IsDeleted)
                .OrderBy(a => a.CheckIn)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                return NotFound();
            }

            var result = ApplyStatusLogic(attendanceRecords);
            return Ok(result);
        }

        //  Get the latest attendance record for a user
        [HttpGet]
        [Route("api/AttendanceUser/user/{userId}/last")]
        [ResponseType(typeof(AttendanceUser))]
        public async Task<IHttpActionResult> GetLastAttendanceForUser(int userId)
        {
            var attendanceRecords = await db.AttendanceUsers
                .Where(a => a.UserId == userId && !a.IsDeleted)
                .OrderByDescending(a => a.CheckIn) // Sort by CheckIn descending
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                return NotFound();
            }

            // ✅ Identify the latest date with attendance records
            DateTime latestDate = attendanceRecords.First().CheckIn.Date;

            // ✅ Get all records for the latest date
            var latestDayRecords = attendanceRecords
                .Where(a => a.CheckIn.Date == latestDate)
                .OrderBy(a => a.CheckIn) // Ensure they are ordered by time
                .ToList();

            // ✅ Apply status logic to the latest day's records
            var result = ApplyStatusLogic(latestDayRecords);

            return Ok(result.LastOrDefault()); // Ensure the latest check-in of the day is returned
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

            var startDate = new DateTime(year, month, 1).Date;
            var endDate = startDate.AddMonths(1);

            var attendanceRecords = await db.AttendanceUsers
                .Where(a => a.UserId == userId && !a.IsDeleted && a.CheckIn >= startDate && a.CheckIn < endDate)
                .OrderBy(a => a.CheckIn)
                .ToListAsync();

            if (!attendanceRecords.Any())
            {
                return NotFound();
            }

            var result = ApplyStatusLogic(attendanceRecords);
            return Ok(result);
        }

        private List<Records> ApplyStatusLogic(List<AttendanceUser> attendanceRecords)
        {
            List<Records> result = new List<Records>();
            string lastStatus = "";
            DateTime? lastCheckOut = null;

            for (int i = 0; i < attendanceRecords.Count; i++)
            {
                var record = attendanceRecords[i];
                string status = "";

                // ✅ First check-in should determine "Present On Time" or "Present Late"
                if (i == 0 || record.CheckIn.Date != attendanceRecords[i - 1].CheckIn.Date)
                {
                    status = record.CheckIn.TimeOfDay < TimeSpan.FromHours(8) ? "Present On Time" : "Present Late";
                }
                else // ✅ Other check-ins should track re-entries
                {
                    if (lastCheckOut.HasValue && record.CheckIn > lastCheckOut)
                    {
                        if (lastStatus == "Leave")
                            status = "Came after Leave";
                        else if (lastStatus == "Break")
                            status = "Came after Break";
                    }
                }

                // ✅ Determine status based on CheckOut time
                if (record.CheckOut.HasValue)
                {
                    var checkOutTime = record.CheckOut.Value.TimeOfDay;
                    if (checkOutTime < TimeSpan.FromHours(14))
                        status = "Leave";
                    else if (checkOutTime < TimeSpan.FromHours(15))
                        status = "Break";
                    else if (checkOutTime < TimeSpan.FromHours(17))
                        status = "Leave";
                    else if (checkOutTime <= TimeSpan.FromHours(17.5))
                        status = "Leave On Time";
                    else
                        status = "Over Time";

                    lastCheckOut = record.CheckOut;
                }

                lastStatus = status;

                // ✅ Convert Working Hours to HH hours MM minutes format
                TimeSpan workingTime = record.CheckOut.HasValue ? (record.CheckOut.Value - record.CheckIn) : TimeSpan.Zero;
                string formattedWorkingHours = $"{(int)workingTime.TotalHours} hours {workingTime.Minutes} minutes";

                result.Add(new Records
                {
                    Date = record.CheckIn.ToString("yyyy-MM-dd"),
                    CheckIn = record.CheckIn.ToString("hh:mm tt"),
                    CheckOut = record.CheckOut?.ToString("hh:mm tt") ?? "N/A",
                    Status = status,
                    WorkingHours = workingTime
                });
            }

            return result;
        }


        //private double CalculateWorkingHours(List<AttendanceUser> records)
        //{
        //    double totalHours = 0;
        //    foreach (var record in records)
        //    {
        //        if (record.CheckOut.HasValue)
        //        {
        //            totalHours += (record.CheckOut.Value - record.CheckIn).TotalHours;
        //        }
        //    }
        //    return Math.Round(totalHours, 2);
        //}

    }

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

/* [HttpGet]
         //public async Task<IHttpActionResult> GetAttendanceUserById(int id)
        //{
        //    var attendanceRecords = await db.AttendanceUsers
        //        .Where(a => a.UserId == id && !a.IsDeleted)
        //        .OrderBy(a => a.CheckIn)
        //        .ToListAsync();

        //    var groupedRecords = attendanceRecords
        //        .GroupBy(a => a.CheckIn.Date)
        //        .ToDictionary(g => g.Key, g => g.ToList());

        //    var startDate = attendanceRecords.Any() ? attendanceRecords.Min(a => a.CheckIn).Date : DateTime.Today;
        //    var endDate = DateTime.Today;
        //    var result = new List<object>();

        //    for (var date = startDate; date <= endDate; date = date.AddDays(1))
        //    {
        //        var dayRecords = groupedRecords.ContainsKey(date) ? groupedRecords[date] : new List<AttendanceUser>();
        //        List<object> recordsList = new List<object>();

        //        if (dayRecords.Any())
        //        {
        //            double totalHours = 0;
        //            string lastStatus = "";
        //            DateTime? lastCheckOut = null;

        //            for (int i = 0; i < dayRecords.Count; i++)
        //            {
        //                var record = dayRecords[i];
        //                string status = "";

        //                // ✅ First check-in of the day should be "Present On Time" or "Present Late"
        //                if (i == 0)
        //                {
        //                    status = record.CheckIn.TimeOfDay < TimeSpan.FromHours(8) ? "Present On Time" : "Present Late";
        //                }
        //                else // ✅ Subsequent check-ins should determine if user came after leave/break
        //                {
        //                    if (lastCheckOut.HasValue && record.CheckIn > lastCheckOut)
        //                    {
        //                        if (lastStatus == "Leave")
        //                            status = "Came after Leave";
        //                        else if (lastStatus == "Break")
        //                            status = "Came after Break";
        //                    }
        //                }

        //                // ✅ Determine status based on CheckOut time
        //                if (record.CheckOut.HasValue)
        //                {
        //                    var checkOutTime = record.CheckOut.Value.TimeOfDay;
        //                    if (checkOutTime < TimeSpan.FromHours(14))
        //                        status = "Leave";
        //                    else if (checkOutTime < TimeSpan.FromHours(15))
        //                        status = "Break";
        //                    else if (checkOutTime < TimeSpan.FromHours(17))
        //                        status = "Leave";
        //                    else if (checkOutTime <= TimeSpan.FromHours(17.5))
        //                        status = "Leave On Time";
        //                    else
        //                        status = "Over Time";

        //                    lastCheckOut = record.CheckOut;
        //                }

        //                lastStatus = status;
        //                double workingHours = record.CheckOut.HasValue ? (record.CheckOut.Value - record.CheckIn).TotalHours : 0;
        //                totalHours += workingHours;

        //                recordsList.Add(new
        //                {
        //                    CheckIn = record.CheckIn.ToString("hh:mm tt"),
        //                    CheckOut = record.CheckOut?.ToString("hh:mm tt"),
        //                    Status = status,
        //                    WorkingHours = Math.Round(workingHours, 2)
        //                });
        //            }

        //            result.Add(new
        //            {
        //                date = date.ToString("yyyy-MM-dd"),
        //                records = recordsList,
        //                TotalWorkingHours = Math.Round(totalHours, 2)
        //            });
        //        }
        //        else
        //        {
        //            result.Add(new
        //            {
        //                date = date.ToString("yyyy-MM-dd"),
        //                records = new List<object> { new { CheckIn = "N/A", CheckOut = "N/A", Status = "Absent", WorkingHours = 0 } },
        //                TotalWorkingHours = 0
        //            });
        //        }
        //    }
        //    return Ok(result);
        //}


        
*/