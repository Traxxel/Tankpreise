using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tankpreise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddStationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "station_details",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", nullable: false),
                    brand = table.Column<string>(type: "varchar(50)", nullable: false),
                    street = table.Column<string>(type: "varchar(100)", nullable: false),
                    house_number = table.Column<string>(type: "varchar(10)", nullable: false),
                    post_code = table.Column<int>(type: "integer", nullable: false),
                    place = table.Column<string>(type: "varchar(100)", nullable: false),
                    whole_day = table.Column<bool>(type: "boolean", nullable: false),
                    is_open = table.Column<bool>(type: "boolean", nullable: false),
                    latitude = table.Column<decimal>(type: "numeric(10,8)", nullable: false),
                    longitude = table.Column<decimal>(type: "numeric(10,8)", nullable: false),
                    last_update = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station_details", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "station_details");
        }
    }
}
