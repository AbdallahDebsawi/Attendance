using Attendance.Data;
using Attendance.Models;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Attendance.Controllers
{
    public class DepartmentController : ApiController
    {
        private AttendanceDb db = new AttendanceDb();

        [HttpGet]
        [Route("api/department/GetAllDepartments")]
        public IHttpActionResult GetAllDepartments()
        {
            try
            {
                var departments = db.Departments.Where(d => !d.IsDeleted).ToList();  // Exclude IsDeleted = true

                if (departments == null || !departments.Any())
                {
                    return Content(HttpStatusCode.NotFound,
                        new { Message = "No departments found in the system." });
                }

                return Ok(new
                {
                    Message = "Departments retrieved successfully.",
                    Data = departments
                });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError,
                    new { Message = "An error occurred while fetching departments.", Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/department/{id}", Name = "GetDepartmentById")]
        public IHttpActionResult GetDepartmentById(int id)
        {
            try
            {
                var department = db.Departments.SingleOrDefault(d => d.Id == id && !d.IsDeleted);  // Exclude IsDeleted = true

                if (department == null)
                {
                    return Content(HttpStatusCode.NotFound,
                        new { Message = $"Department with ID {id} not found." });
                }

                return Ok(new
                {
                    Message = "Department retrieved successfully.",
                    Data = department
                });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError,
                    new { Message = "An error occurred while fetching the department.", Error = ex.Message });
            }
        }

        [HttpPut]
        [Route("api/department/{id}")]
        public IHttpActionResult UpdateDepartment(int id, Department department)
        {
            try
            {
                if (department == null || id != department.Id)
                {
                    return Content(HttpStatusCode.BadRequest,
                        new { Message = "Invalid department data or ID mismatch." });
                }

                // Check if the department with the new name already exists (exclude the current department)
                var existingDepartmentWithName = db.Departments.SingleOrDefault(d => d.DepartmentName.Equals(department.DepartmentName, StringComparison.OrdinalIgnoreCase) && d.Id != id && !d.IsDeleted);

                if (existingDepartmentWithName != null)
                {
                    return Content(HttpStatusCode.BadRequest,
                        new { Message = "A department with the same name already exists." });
                }

                var existingDepartment = db.Departments.SingleOrDefault(d => d.Id == id && !d.IsDeleted);  // Exclude IsDeleted = true

                if (existingDepartment == null)
                {
                    return Content(HttpStatusCode.NotFound,
                        new { Message = $"Department with ID {id} not found." });
                }

                // Update the department name and modification date
                existingDepartment.DepartmentName = department.DepartmentName;
                existingDepartment.ModificationDate = DateTime.UtcNow; // Set the modification date to current time

                db.SaveChanges();

                return Ok(new
                {
                    Message = "Department updated successfully.",
                    Data = existingDepartment
                });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError,
                    new { Message = "An error occurred while updating the department.", Error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("api/department/{id}")]
        public IHttpActionResult DeleteDepartment(int id)
        {
            try
            {
                var department = db.Departments.SingleOrDefault(d => d.Id == id);

                if (department == null)
                {
                    return Content(HttpStatusCode.NotFound,
                        new { Message = $"Department with ID {id} not found." });
                }

                department.IsDeleted = true;
                department.ModificationDate = DateTime.UtcNow;

                db.SaveChanges();

                return Ok(new { Message = "Department marked as deleted successfully." });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError,
                    new { Message = "An error occurred while marking the department as deleted.", Error = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/department")]
        public IHttpActionResult CreateDepartment(Department department)
        {
            try
            {
                if (department == null)
                {
                    return Content(HttpStatusCode.BadRequest,
                        new { Message = "Invalid department data." });
                }

                // Check if a department with the same name already exists and is not deleted
                var existingDepartment = db.Departments.SingleOrDefault(d => d.DepartmentName.Equals(department.DepartmentName, StringComparison.OrdinalIgnoreCase) && !d.IsDeleted);

                if (existingDepartment != null)
                {
                    return Content(HttpStatusCode.BadRequest,
                        new { Message = "A department with the same name already exists." });
                }

                // Set the created date and created by information
              
                department.CreatedBy = "System";
               

                // Set the IsDeleted flag to false explicitly (though it defaults to false)
                

                db.Departments.Add(department);
                db.SaveChanges();

                // Return success response with the created department
                return CreatedAtRoute("GetDepartmentById", new { id = department.Id },
                    new { Message = "Department created successfully.", Data = department });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError,
                    new { Message = "An error occurred while creating the department.", Error = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet]
        [Route("api/department/users")]
        public IHttpActionResult GetDepartmentsWithUsers()
        {
            try
            {
                
                var departmentsWithUsers = db.Departments
                    .Where(d => !d.IsDeleted)  
                    .Select(d => new
                    {
                        DepartmentName = d.DepartmentName,
                        Users = d.Users.Where(u => !u.IsDeleted)  
                                       .Select(u => u.Name)  
                                       .ToList()
                    }).ToList();

                if (departmentsWithUsers == null || !departmentsWithUsers.Any())
                {
                    return Content(HttpStatusCode.NotFound, new { Message = "No departments or users found." });
                }

                return Ok(new
                {
                    Message = "Departments and users retrieved successfully.",
                    Data = departmentsWithUsers
                });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while fetching departments and users.", Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/department/{depId}/users")]
        public IHttpActionResult GetUsersByDepartment(int depId)
        {
            try
            {
                var departmentWithUsers = db.Departments
                    .Where(d => d.Id == depId && !d.IsDeleted)  
                    .Select(d => new
                    {
                        DepartmentName = d.DepartmentName,
                        Users = d.Users.Where(u => !u.IsDeleted)  
                                       .Select(u => u.Name)  
                                       .ToList()
                    })
                    .FirstOrDefault();

                if (departmentWithUsers == null)
                {
                    return Content(HttpStatusCode.NotFound, new { Message = "Department or users not found." });
                }

                return Ok(new
                {
                    Message = "Users retrieved successfully.",
                    Data = departmentWithUsers
                });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { Message = "An error occurred while retrieving users.", Error = ex.Message });
            }
        }


    }
}
