namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixservererror : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AttendanceUsers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CheckIn = c.DateTime(nullable: false),
                        CheckOut = c.DateTime(),
                        Status = c.String(),
                        WorkingHours = c.Time(nullable: false, precision: 7),
                        UserId = c.Int(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        CreatedBy = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        ModificationDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            AlterColumn("dbo.Departments", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Users", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Requests", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Roles", "CreatedAt", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AttendanceUsers", "UserId", "dbo.Users");
            DropIndex("dbo.AttendanceUsers", new[] { "UserId" });
            AlterColumn("dbo.Roles", "CreatedAt", c => c.String());
            AlterColumn("dbo.Requests", "CreatedAt", c => c.String());
            AlterColumn("dbo.Users", "CreatedAt", c => c.String());
            AlterColumn("dbo.Departments", "CreatedAt", c => c.String());
            DropTable("dbo.AttendanceUsers");
        }
    }
}
