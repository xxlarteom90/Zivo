namespace DeliveryApp.Application.Common;

public sealed record AddressDto(
    Guid Id,
    string Line1,
    string? Line2,
    string City,
    string? CountyOrRegion,
    string? PostalCode,
    string Country,
    decimal? Latitude,
    decimal? Longitude,
    string Summary);

public sealed record CreateAddressDto(
    string Line1,
    string? Line2,
    string City,
    string? CountyOrRegion,
    string? PostalCode,
    string Country,
    decimal? Latitude,
    decimal? Longitude);
