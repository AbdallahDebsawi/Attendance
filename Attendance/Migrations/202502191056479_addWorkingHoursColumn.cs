namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addWorkingHoursColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Double());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AttendanceUsers", "WorkingHours");
        }
    }
}
