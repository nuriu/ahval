using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace backend.Migrations
{
    public partial class NormalizationForUserWeeklyItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RowNumber",
                table: "UserWeeklyItems",
                type: "int4",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "UserWeeklyItems");

            migrationBuilder.DropColumn(
                name: "RowNumber",
                table: "UserWeeklyItems");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Notes",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Issues",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }
    }
}
