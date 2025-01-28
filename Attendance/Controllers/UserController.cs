using Attendance.Data;
using Attendance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class UserController : ApiController
    {

        private AttendanceDb db = new AttendanceDb();


        [HttpGet]
        [Route("api/User/GetAllUsers")]
        public IHttpActionResult GetAllUsers()
        {
            try
            {
                var users = db.Users
                              .Include("Role")
                              .Include("Department")
                              .Include("Requests")
                              .ToList();

                if (users == null || !users.Any())
                {
                    return BadRequest("There is no Users in the Database"); 
                }

                return Ok(users);
            }

            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        [HttpGet]
        [Route("api/User/GetUserById/{id}")]
        public IHttpActionResult GetUserById(int id)
        {
            try
            {
                
                var user = db.Users
                             .Include("Role")
                             .Include("Department")
                             .Include("Requests")
                             .FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(); 
                }

              
                return Ok(user);
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("api/User/AddUser")]
        public IHttpActionResult AddUser(User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("Invalid user data.");
                }

                db.Users.Add(user);
                db.SaveChanges();

                return Created($"api/User/GetUserById/{user.Id}", user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        // PUT: api/User/UpdateUser/{id}
        [HttpPut]
        [Route("api/User/UpdateUser/{id}")]
        public IHttpActionResult UpdateUser(int id, User updatedUser)
        {
            try
            {
                // Validate input
                if (updatedUser == null || id != updatedUser.Id)
                {
                    return BadRequest("Invalid user data or ID mismatch.");
                }

                // Retrieve the existing user from the database
                var existingUser = db.Users.FirstOrDefault(u => u.Id == id);
                if (existingUser == null)
                {
                    return NotFound(); // User with the given ID doesn't exist
                }

                // Update the properties of the existing user
                existingUser.ManagerId = updatedUser.ManagerId;
                existingUser.Name = updatedUser.Name;
                existingUser.Email = updatedUser.Email;
                existingUser.Password = updatedUser.Password;
                existingUser.Gender = updatedUser.Gender;
                existingUser.Salary = updatedUser.Salary;
                existingUser.JoinDate = updatedUser.JoinDate;
                existingUser.LeftDate = updatedUser.LeftDate;
                existingUser.RoleId = updatedUser.RoleId;
                existingUser.DepartmentId = updatedUser.DepartmentId;

                // Save the changes to the database
                db.SaveChanges();

                // Return the updated user as the response
                return Ok(existingUser);
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur
                return InternalServerError(ex);
            }
        }



        [HttpDelete]
        [Route("api/User/DeleteUser/{id}")]
        public IHttpActionResult DeleteUser(int id)
        {
            try
            {
                var user = db.Users.FirstOrDefault(u => u.Id == id);
                if (user == null)
                {
                    return NotFound();
                }

                db.Users.Remove(user);
                db.SaveChanges();

                return Ok($"User with ID {id} has been deleted.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
