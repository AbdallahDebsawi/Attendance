namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AllowNullCheckIn : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AttendanceUsers", "CheckIn", c => c.DateTime(nullable: true));

        }

        public override void Down()
        {
            AlterColumn("dbo.AttendanceUsers", "CheckIn", c => c.DateTime(nullable: false));

        }
    }
}
