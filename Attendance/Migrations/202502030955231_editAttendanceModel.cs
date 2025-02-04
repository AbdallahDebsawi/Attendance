namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class editAttendanceModel : DbMigration
    {
        public override void Up()
        {
            // Drop and recreate the column as Double
            DropColumn("dbo.AttendanceUsers", "WorkingHours");
            AddColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Double());
        }

        public override void Down()
        {
            // Revert the column back to Time (precision: 7)
            DropColumn("dbo.AttendanceUsers", "WorkingHours");
            AddColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Time(precision: 7));
        }
    }
}
