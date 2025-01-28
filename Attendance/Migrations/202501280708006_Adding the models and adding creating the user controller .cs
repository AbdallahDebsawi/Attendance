namespace Attendance.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addingthemodelsandaddingcreatingtheusercontroller : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Departments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DepartmentName = c.String(),
                        CreatedAt = c.String(),
                        CreatedBy = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        ModificationDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ManagerId = c.Int(nullable: false),
                        Name = c.String(),
                        Email = c.String(),
                        Password = c.String(),
                        Gender = c.String(),
                        Salary = c.Decimal(nullable: false, precision: 18, scale: 2),
                        JoinDate = c.DateTime(nullable: false),
                        LeftDate = c.DateTime(nullable: false),
                        RoleId = c.Int(nullable: false),
                        DepartmentId = c.Int(nullable: false),
                        RequestId = c.Int(nullable: false),
                        CreatedAt = c.String(),
                        CreatedBy = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        ModificationDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Departments", t => t.DepartmentId, cascadeDelete: true)
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.DepartmentId);
            
            CreateTable(
                "dbo.Requests",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TypeOfAbsence = c.String(),
                        From = c.DateTime(nullable: false),
                        To = c.DateTime(nullable: false),
                        ReasonOfAbsence = c.String(),
                        IsApproved = c.Boolean(nullable: false),
                        UserId = c.Int(nullable: false),
                        CreatedAt = c.String(),
                        CreatedBy = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        ModificationDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RoleName = c.String(),
                        CreatedAt = c.String(),
                        CreatedBy = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        ModificationDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.Requests", "UserId", "dbo.Users");
            DropForeignKey("dbo.Users", "DepartmentId", "dbo.Departments");
            DropIndex("dbo.Requests", new[] { "UserId" });
            DropIndex("dbo.Users", new[] { "DepartmentId" });
            DropIndex("dbo.Users", new[] { "RoleId" });
            DropTable("dbo.Roles");
            DropTable("dbo.Requests");
            DropTable("dbo.Users");
            DropTable("dbo.Departments");
        }
    }
}
