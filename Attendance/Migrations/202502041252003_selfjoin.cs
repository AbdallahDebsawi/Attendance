namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class selfjoin : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "ManagerId", c => c.Int());
            AlterColumn("dbo.Users", "RoleId", c => c.Int(nullable: false));
            CreateIndex("dbo.Users", "ManagerId");
            AddForeignKey("dbo.Users", "ManagerId", "dbo.Users", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "ManagerId", "dbo.Users");
            DropIndex("dbo.Users", new[] { "ManagerId" });
            AlterColumn("dbo.Users", "RoleId", c => c.Int());
            AlterColumn("dbo.Users", "ManagerId", c => c.Int(nullable: false));
        }
    }
}
