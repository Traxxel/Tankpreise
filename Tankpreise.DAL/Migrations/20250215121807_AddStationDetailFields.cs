using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Tankpreise.DAL.Models;

#nullable disable

namespace Tankpreise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddStationDetailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "state",
                table: "station_details",
                type: "varchar(4)",
                nullable: true,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "opening_times",
                table: "station_details",
                type: "jsonb",
                nullable: true,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "overrides",
                table: "station_details",
                type: "jsonb",
                nullable: true,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "state",
                table: "station_details");

            migrationBuilder.DropColumn(
                name: "opening_times",
                table: "station_details");

            migrationBuilder.DropColumn(
                name: "overrides",
                table: "station_details");
        }
    }
}
