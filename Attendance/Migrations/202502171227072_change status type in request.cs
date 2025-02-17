namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changestatustypeinrequest : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Requests", "ManagerStatus", c => c.Long(nullable: false));
            AlterColumn("dbo.Requests", "HRStatus", c => c.Long(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Requests", "HRStatus", c => c.String());
            AlterColumn("dbo.Requests", "ManagerStatus", c => c.String());
        }
    }
}
