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

            Request request = new Request()
            {
                TypeOfAbsence = model.TypeOfAbsence,
                From = model.From,
                To = model.To,
                ReasonOfAbsence = model.ReasonOfAbsence,
                MangerStatus = model.MangerStatus,
                HRStatus = model.HRStatus,
                UserId = model.UserId
            };
            db.Requests.Add(request);
            db.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Route("api/RequestDelete")]
        public IHttpActionResult Delete(int id)
        {
            var request = db.Requests.Find(id);
            if (request != null)
            {
                db.Requests.Remove(request);
                db.SaveChanges();
            }
            return NotFound();
        }


        [HttpGet]
        [Route("api/GetAllRequest")]
        public IHttpActionResult GetAll()
        {
            List<RequestViewModel> result = new List<RequestViewModel>();
            result = db.Requests.Select(r => new RequestViewModel
            {
                TypeOfAbsence = r.TypeOfAbsence,
                From = r.From,
                To = r.To,
                ReasonOfAbsence = r.ReasonOfAbsence,
                MangerStatus = r.MangerStatus,
                HRStatus = r.HRStatus,
                UserId = r.UserId
            }).ToList();
            return Ok(result);
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
        [Route("api/request/{id}")]
        public IHttpActionResult Update(int id, Request model)
        {
            if (id == 0)
            {
                return NotFound();
            }

            var request = new Request()
            {
                Id = id,
                TypeOfAbsence = model.TypeOfAbsence,
                From = model.From,
                To = model.To,
                ReasonOfAbsence = model.ReasonOfAbsence,
                MangerStatus = model.MangerStatus,
                HRStatus = model.HRStatus,
                UserId = model.UserId
            };

            db.Requests.AddOrUpdate(request);
            db.SaveChanges();
            return Ok();
        }
    }
}
