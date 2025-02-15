using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Tankpreise.DAL.Models;

[Table("station_details")]
public class StationDetail
{
    [Key]
    [Column("id", TypeName = "uuid")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [Required]
    [Column("name", TypeName = "varchar(100)")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column("brand", TypeName = "varchar(50)")]
    [JsonPropertyName("brand")]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [Column("street", TypeName = "varchar(100)")]
    [JsonPropertyName("street")]
    public string Street { get; set; } = string.Empty;

    [Column("house_number", TypeName = "varchar(10)")]
    [JsonPropertyName("houseNumber")]
    public string HouseNumber { get; set; } = string.Empty;

    [Required]
    [Column("post_code", TypeName = "integer")]
    [JsonPropertyName("postCode")]
    public int PostCode { get; set; }

    [Required]
    [Column("place", TypeName = "varchar(100)")]
    [JsonPropertyName("place")]
    public string Place { get; set; } = string.Empty;

    [Required]
    [Column("whole_day", TypeName = "boolean")]
    [JsonPropertyName("wholeDay")]
    public bool WholeDay { get; set; }

    [Required]
    [Column("is_open", TypeName = "boolean")]
    [JsonPropertyName("isOpen")]
    public bool IsOpen { get; set; }

    [Required]
    [Column("latitude", TypeName = "numeric(10,8)")]
    [JsonPropertyName("lat")]
    public decimal Latitude { get; set; }

    [Required]
    [Column("longitude", TypeName = "numeric(10,8)")]
    [JsonPropertyName("lng")]
    public decimal Longitude { get; set; }

    [Column("last_update", TypeName = "timestamp")]
    public DateTime LastUpdate { get; set; } = DateTime.Now;
} 