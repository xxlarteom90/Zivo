using DeliveryApp.Domain.Common;

namespace DeliveryApp.Domain.Entities;

public sealed class Address : AuditableEntity
{
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string? CountyOrRegion { get; set; }
    public string? PostalCode { get; set; }
    public string Country { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    public string ToSingleLine()
    {
        var parts = new[] { Line1, Line2, City, CountyOrRegion, PostalCode, Country }
            .Where(value => !string.IsNullOrWhiteSpace(value));

        return string.Join(", ", parts);
    }
}
