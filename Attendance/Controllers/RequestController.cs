using Attendance.Data;
using Attendance.Models;
using Attendance.Models.Enums;
using Attendance.Models.Interfaces;
using Attendance.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
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

    [EnableCors(origins: "*", headers: "*", methods: "*")]
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
                var user = db.Users.Find(model.UserId);
                if (user == null)
                {
                    return BadRequest("User not found");
                }

                

                // Add the request
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
        public IHttpActionResult GetAll([FromUri] int userId, [FromUri] int isManager)
        {
            if (userId == 0)
            {
                return BadRequest("User ID is required.");
            }

            if (isManager == 0)
            {
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
                        ManagerStatus = r.ManagerStatus,
                        HRStatus = r.HRStatus,
                        UserId = r.UserId,
                        Name = r.Users.Name
                    })
                    .ToList();
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return InternalServerError(ex);
                }
            }
            else
            {
                var role = db.Users.Find(isManager).RoleId;
                if (role ==(int) Role.Manager)
                {
                    try
                    {
                        var userRequests = from r in db.Requests
                                           from u in db.Users
                                           where u.ManagerId == isManager && u.Id == r.UserId
                                           select  new RequestViewModel
                                           {
                                               Id = r.Id,
                                               TypeOfAbsence = r.TypeOfAbsence,
                                               From = r.From,
                                               To = r.To,
                                               ReasonOfAbsence = r.ReasonOfAbsence,
                                               ManagerStatus = r.ManagerStatus,
                                               HRStatus = r.HRStatus,
                                               UserId = r.UserId,
                                               Name = r.Users.Name,
                                           };
                        return Ok(userRequests);
                        //      var userRequests = db.Requests
                        //.Where(r => db.Users.Any(u => u.ManagerId == isManager && u.Id == r.UserId))
                        //.Select(r => new RequestViewModel
                        //{
                        //    Id = r.Id,
                        //    TypeOfAbsence = r.TypeOfAbsence,
                        //    From = r.From,
                        //    To = r.To,
                        //    ReasonOfAbsence = r.ReasonOfAbsence,
                        //    ManagerStatus = r.ManagerStatus,
                        //    HRStatus = r.HRStatus,
                        //    UserId = r.UserId,
                        //    Name = r.Users.Name,
                        //})
                        //.ToList();
                        //      return Ok(userRequests);

                    }
                    catch (Exception ex)
                    {
                        return InternalServerError(ex);
                    }

                }
                else
                {
                    try
                    {
                        var result = db.Requests
                            .Where(r => r.UserId != userId)
                            .Select(r => new RequestViewModel
                            {
                                Id = r.Id,
                                TypeOfAbsence = r.TypeOfAbsence,
                                From = r.From,
                                To = r.To,
                                ReasonOfAbsence = r.ReasonOfAbsence,
                                ManagerStatus = r.ManagerStatus,
                                HRStatus = r.HRStatus,
                                UserId = r.UserId,
                                Name = r.Users.Name
                            })
                            .ToList();

                        return Ok(result);
                    }
                    catch (Exception ex)
                    {
                        return InternalServerError(ex);
                    }

                }
               
            }

        }

        [HttpGet]
        [Route("api/GetEmployeeRequestByManager")]
        public IHttpActionResult GetAllRequestByManager([FromUri] int managerId)
        {
            try
            {
                var managerRequests = db.Requests
                    .Where(r => r.UserId == managerId)
                    .Select(r => new RequestViewModel
                    {
                        Id = r.Id,
                        TypeOfAbsence = r.TypeOfAbsence,
                        From = r.From,
                        To = r.To,
                        ReasonOfAbsence = r.ReasonOfAbsence,
                        ManagerStatus = r.ManagerStatus,
                        HRStatus = r.HRStatus,
                        UserId = r.UserId,
                        Name = r.Users.Name,
                    })
                    .ToList();

                var userRequests = db.Requests
                    .Where(r => db.Users.Any(u => u.ManagerId == managerId && u.Id == r.UserId))
                    .Select(r => new RequestViewModel
                    {
                        Id = r.Id,
                        TypeOfAbsence = r.TypeOfAbsence,
                        From = r.From,
                        To = r.To,
                        ReasonOfAbsence = r.ReasonOfAbsence,
                        ManagerStatus = r.ManagerStatus,
                        HRStatus = r.HRStatus,
                        UserId = r.UserId,
                        Name = r.Users.Name,
                    })
                    .ToList();

                var allRequests = managerRequests.Concat(userRequests).ToList();

                return Ok(allRequests);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/GetAllRequestByHr")]
        public IHttpActionResult GetAllByHr()
        {
            try
            {
                var result = db.Requests
                    .Select(r => new RequestViewModel
                    {
                        Id = r.Id,
                        TypeOfAbsence = r.TypeOfAbsence,
                        From = r.From,
                        To = r.To,
                        ReasonOfAbsence = r.ReasonOfAbsence,
                        ManagerStatus = r.ManagerStatus,
                        HRStatus = r.HRStatus,
                        UserId = r.UserId,
                        Name = r.Users.Name
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
            result.ManagerStatus = request.ManagerStatus;
            result.HRStatus = request.HRStatus;
            result.UserId = request.UserId;
            return Ok(result);
        }


        [HttpPut]
        [Route("api/UpdateRequest/{id}")]
        public IHttpActionResult Update(int id, Request model)
        {
            if (id == 0)
            {
                return BadRequest("Invalid Request Id");
            }

            var existingRequest = db.Requests.FirstOrDefault(r => r.Id == id);
            if (existingRequest == null)
            {
                return NotFound();
            }

            existingRequest.TypeOfAbsence = model.TypeOfAbsence;
            existingRequest.From = model.From;
            existingRequest.To = model.To;
            existingRequest.ReasonOfAbsence = model.ReasonOfAbsence;
            existingRequest.ManagerStatus = model.ManagerStatus;
            existingRequest.HRStatus = model.HRStatus;
            existingRequest.UserId = model.UserId;

            db.SaveChanges();
            return Ok(existingRequest);
        }




    }
}