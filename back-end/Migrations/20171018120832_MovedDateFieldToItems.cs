using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace backend.Migrations
{
    public partial class MovedDateFieldToItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "UserWeeklyItems");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Notes",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Issues",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Issues");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "UserWeeklyItems",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }
    }
}
