namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateManagerStatus : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Requests", "ManagerStatus", c => c.String());
            DropColumn("dbo.Requests", "MangerStatus");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Requests", "MangerStatus", c => c.String());
            DropColumn("dbo.Requests", "ManagerStatus");
        }
    }
}
