using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Tankpreise.DAL.Models;

[Table("station_preise")]
public class StationPreise
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Column("stations_id", TypeName = "uuid")]
    [JsonPropertyName("stationId")]
    public string StationsId { get; set; } = string.Empty;

    [Required]
    [Column("timestamp", TypeName = "timestamp")]
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }

    [Required]
    [Column("status", TypeName = "varchar(10)")]
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [Required]
    [Column("e5", TypeName = "numeric(4,3)")]
    [JsonPropertyName("e5")]
    public decimal E5 { get; set; }

    [Required]
    [Column("e10", TypeName = "numeric(4,3)")]
    [JsonPropertyName("e10")]
    public decimal E10 { get; set; }

    [Required]
    [Column("diesel", TypeName = "numeric(4,3)")]
    [JsonPropertyName("diesel")]
    public decimal Diesel { get; set; }
} 