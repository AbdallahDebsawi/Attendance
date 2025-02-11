using Attendance.Data;
using Attendance.Models;
using Attendance.Models.Interfaces;
using Attendance.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Attendance.Controllers
{

    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class RequestController : ApiController, IAttendance<Request>
    {
        private AttendanceDb db = new AttendanceDb();


        [HttpPost]
        [Route("api/CreateRequest")]
        public IHttpActionResult Create(Request model)
        {
            if (model == null)
            {
                return BadRequest("Invalid Request data");
            }
            try
            {
                db.Requests.Add(model);
                db.SaveChanges();
                return Ok();

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("api/RequestDelete/{id}")]
        public IHttpActionResult Delete(int id)
        {
            var request = db.Requests.FirstOrDefault(r => r.Id == id);
            if (request != null)
            {
                try
                {
                    db.Requests.Remove(request);
                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return InternalServerError(ex);
                }
            }
            return NotFound();
        }


        [HttpGet]
        [Route("api/GetAllRequest")]
        public IHttpActionResult GetAll([FromUri] int userId)
        {
            if (userId == 0)
            {
                return BadRequest("User ID is required.");
            }
            try
            {
                var result = db.Requests
                .Where(r => r.UserId == userId)
                .Select(r => new RequestViewModel
                {
                    Id = r.Id,
                    TypeOfAbsence = r.TypeOfAbsence,
                    From = r.From,
                    To = r.To,
                    ReasonOfAbsence = r.ReasonOfAbsence,
                    MangerStatus = r.MangerStatus,
                    HRStatus = r.HRStatus,
                    UserId = r.UserId,
                    Name = r.User.Name
                })
                .ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
            



        [HttpGet]
        [Route("api/GetRequestById")]
        public IHttpActionResult GetById(int id)
        {
            var request = db.Requests.Find(id);
            if (request == null)
            {
                return NotFound();
            }
            RequestViewModel result = new RequestViewModel();
            result.TypeOfAbsence = request.TypeOfAbsence;
            result.From = request.From;
            result.To = request.To;
            result.ReasonOfAbsence = request.ReasonOfAbsence;
            result.MangerStatus = request.MangerStatus;
            result.HRStatus = request.HRStatus;
            result.UserId = request.UserId;
            return Ok(result);
        }

        [HttpPut]
        [Route("api/UpdateRequest/{id}")]
        public IHttpActionResult Update(int id, Request model)
        {
            var request = db.Requests.Find(id);
            if (request == null) return NotFound();

            db.Entry(request).CurrentValues.SetValues(model);
            db.SaveChanges();

            return Ok();
        }

    }
}
