namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixAttendanceModel : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Time(precision: 7));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Time(nullable: false, precision: 7));
        }
    }
}
