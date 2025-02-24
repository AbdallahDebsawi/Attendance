namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Double());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Single());
        }
    }
}
