namespace DeliveryApp.Application.PartnerBusinesses;

public sealed record PartnerBusinessSummaryDto(
    Guid Id,
    string Name,
    string BusinessType,
    string PhoneNumber,
    string? Email);

public sealed record PartnerBusinessListItemDto(
    Guid Id,
    string Name,
    string BusinessType,
    string PhoneNumber,
    string? Email,
    bool IsActive,
    string AddressSummary);
