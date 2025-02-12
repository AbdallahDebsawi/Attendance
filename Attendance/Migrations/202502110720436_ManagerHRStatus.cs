namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ManagerHRStatus : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Requests", "MangerStatus", c => c.String());
            AlterColumn("dbo.Requests", "HRStatus", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Requests", "HRStatus", c => c.Boolean(nullable: false));
            AlterColumn("dbo.Requests", "MangerStatus", c => c.Boolean(nullable: false));
        }
    }
}
