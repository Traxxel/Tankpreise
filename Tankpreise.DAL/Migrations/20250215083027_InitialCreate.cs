using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Tankpreise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "station_preise",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    stations_id = table.Column<Guid>(type: "uuid", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    status = table.Column<string>(type: "varchar(10)", nullable: false),
                    e5 = table.Column<decimal>(type: "numeric(4,3)", nullable: false),
                    e10 = table.Column<decimal>(type: "numeric(4,3)", nullable: false),
                    diesel = table.Column<decimal>(type: "numeric(4,3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station_preise", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_station_preise_stations_id_timestamp",
                table: "station_preise",
                columns: new[] { "stations_id", "timestamp" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "station_preise");
        }
    }
}
