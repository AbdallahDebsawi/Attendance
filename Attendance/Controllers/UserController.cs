using Attendance.Data;
using Attendance.Models;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Collections.Generic;
using Attendance.Models.dto_s;
using Attendance.Models.Enums;
using System.Data.Entity;


namespace Attendance.Controllers
{
    public class UserController : ApiController
    {
        private AttendanceDb db = new AttendanceDb();

        [HttpGet]
        [Route("api/user")]
        public IHttpActionResult GetAllUsers()
        {
            try
            {
                var users = db.Users
                                    .Where(u => !u.IsDeleted)
                                    .Include(u => u.Department)
                                    .AsEnumerable()
                                    .Select(u => new

                                    {
                                        u.Id,
                                        u.Name,
                                        u.ManagerId,
                                        ManagerName = db.Users.FirstOrDefault(m => m.Id == u.ManagerId)?.Name,
                                        u.Email,
                                        u.Gender,
                                        u.Salary,
                                        JoinDate = u.JoinDate.ToString("yyyy-MM-dd"),
                                        u.RoleId,
                                        DepartmentName = u.Department.DepartmentName,
                                        u.Password,
                                        u.DepartmentId,
                                        u.CreatedBy
                                    }).ToList();
                if (!users.Any())
                {
                    return Content(HttpStatusCode.NotFound, new { Message = "No users found." });
                }

                return Ok(new { Message = "Users retrieved successfully.", Data = users });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while fetching users.", Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/user/{id}")]
        public IHttpActionResult GetUserById(int id)
        {
            try
            {
                var user = db.Users.SingleOrDefault(u => u.Id == id && !u.IsDeleted);

                if (user == null)
                {
                    return Content(HttpStatusCode.NotFound, new { Message = $"User with ID {id} not found." });
                }

                return Ok(new { Message = "User retrieved successfully.", Data = user });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while fetching the user.", Error = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/user/register")]
        public IHttpActionResult RegisterUser(User user)
        {
            try
            {
                if (user == null)
                {
                    return Content(HttpStatusCode.BadRequest, new { Message = "Invalid user data." });
                }

                var existingUser = db.Users.SingleOrDefault(u => u.Email == user.Email && !u.IsDeleted);
                if (existingUser != null)
                {
                    return Content(HttpStatusCode.BadRequest, new { Message = "User with this email already exists." });
                }

                if(user.CreatedBy == null)
                {
                    user.CreatedBy = "System";
                }
                db.Users.Add(user);
                db.SaveChanges();

                return Created($"api/user/{user.Id}", new { Message = "User registered successfully.", Data = user });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new
                {
                    Message = "An error occurred while registering the user.",
                    Error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpPost]
        [Route("api/user/login")]
        public IHttpActionResult Login(LoginDto loginRequest)
        {
            try
            {
                if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
                {
                    return Content(HttpStatusCode.BadRequest, new { Message = "Invalid email or password." });
                }

                var user = db.Users.SingleOrDefault(u => u.Email == loginRequest.Email && u.Password == loginRequest.Password && !u.IsDeleted);

                if (user == null)
                {
                    return Content(HttpStatusCode.Unauthorized, new { Message = "Invalid email or password." });
                }

                return Ok(new { Message = "Login successful.", Data = user });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while logging in.", Error = ex.Message });
            }
        }


        [HttpPut]
        [Route("api/user/{id}")]
        public IHttpActionResult UpdateUser(int id, User user)
        {
            try
            {
                // Check if the user object is null or if there's an ID mismatch
                if (user == null || id != user.Id)
                {
                    return Content(HttpStatusCode.BadRequest, new { Message = "Invalid user data or ID mismatch." });
                }

                // Fetch the user from the database by id
                var existingUser = db.Users.SingleOrDefault(u => u.Id == id && !u.IsDeleted);
                if (existingUser == null)
                {
                    return Content(HttpStatusCode.NotFound, new { Message = $"User with ID {id} not found." });
                }

                // Update the properties that should change
                existingUser.Name = user.Name;
                existingUser.Email = user.Email;
                existingUser.Password = user.Password;
                existingUser.Gender = user.Gender;
                existingUser.Salary = user.Salary;
                existingUser.RoleId = user.RoleId;
                existingUser.DepartmentId = user.DepartmentId;
                existingUser.ManagerId = user.ManagerId;
                existingUser.JoinDate = user.JoinDate;


                // Update the ModificationDate only
                existingUser.ModificationDate = DateTime.UtcNow;

                // Save the changes to the database
                db.SaveChanges();

                // Return a success message with the updated user data
                return Ok(new { Message = "User updated successfully.", Data = existingUser });
            }
            catch (Exception ex)
            {
                // Return an error message in case of an exception
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while updating the user.", Error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("api/user/{id}")]
        public IHttpActionResult DeleteUser(int id)
        {
            try
            {
                var user = db.Users.SingleOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return Content(HttpStatusCode.NotFound, new { Message = $"User with ID {id} not found." });
                }

                user.IsDeleted = true;
                user.ModificationDate = DateTime.UtcNow;
                db.SaveChanges();

                return Ok(new { Message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while deleting the user.", Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/user/GetManagers")]
        public IHttpActionResult GetManagers()
        {
            // Filter by roleId for Manager (1)
            var managers = db.Users
                .Where(u => u.RoleId == (int)Role.Manager && !u.IsDeleted) 
                .Select(u => new { u.Id, u.Name })
                .ToList();

            return Ok(new { Success = true, Data = managers });
        }

        [HttpGet]
        [Route("api/user/manager/{managerId}")]
        public IHttpActionResult GetUsersByManager(int managerId)
        {
            try
            {
                var users = db.Users
                                .Where(u => u.ManagerId == managerId && !u.IsDeleted)
                                .Include(u => u.Department)
                                .AsEnumerable()
                                .Select(u => new
                                {
                                    u.Id,
                                    u.Name,
                                    u.ManagerId,
                                    u.Email,
                                    u.Gender,
                                    u.Salary,
                                    JoinDate = u.JoinDate.ToString("yyyy-MM-dd"),
                                    u.RoleId,
                                    DepartmentName = u.Department.DepartmentName,
                                    u.Password,
                                    u.DepartmentId
                                }).ToList();

                if (!users.Any())
                {
                    return Content(HttpStatusCode.NotFound, new { Message = "No users found for the specified manager." });
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while fetching users.", Error = ex.Message });
            }
        }



    }



}
