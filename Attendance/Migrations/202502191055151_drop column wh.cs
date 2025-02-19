namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dropcolumnwh : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.AttendanceUsers", "WorkingHours");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Double());
        }
    }
}
