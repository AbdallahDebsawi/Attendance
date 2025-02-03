namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateDatabase : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "RoleId", c => c.Int());
            AlterColumn("dbo.Users", "RequestId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "RequestId", c => c.Int(nullable: false));
            AlterColumn("dbo.Users", "RoleId", c => c.Int(nullable: false));
        }
    }
}
