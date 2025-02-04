namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mergeMigrations : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Requests", "MangerStatus", c => c.Boolean(nullable: false));
            AddColumn("dbo.Requests", "HRStatus", c => c.Boolean(nullable: false));
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Double());
            DropColumn("dbo.Requests", "IsApproved");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Requests", "IsApproved", c => c.Boolean(nullable: false));
            AlterColumn("dbo.AttendanceUsers", "WorkingHours", c => c.Time(nullable: false, precision: 7));
            DropColumn("dbo.Requests", "HRStatus");
            DropColumn("dbo.Requests", "MangerStatus");
        }
    }
}
