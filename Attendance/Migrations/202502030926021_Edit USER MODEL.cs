namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditUSERMODEL : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "LeftDate", c => c.DateTime());
            DropColumn("dbo.Users", "RequestId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "RequestId", c => c.Int());
            AlterColumn("dbo.Users", "LeftDate", c => c.DateTime(nullable: false));
        }
    }
}
