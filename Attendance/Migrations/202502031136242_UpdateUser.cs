namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Requests", "MangerStatus", c => c.Boolean(nullable: false));
            AddColumn("dbo.Requests", "HRStatus", c => c.Boolean(nullable: false));
            DropColumn("dbo.Requests", "IsApproved");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Requests", "IsApproved", c => c.Boolean(nullable: false));
            DropColumn("dbo.Requests", "HRStatus");
            DropColumn("dbo.Requests", "MangerStatus");
        }
    }
}
