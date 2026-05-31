namespace DeliveryApp.Application.Customers;

public sealed record CustomerSummaryDto(
    Guid Id,
    string FullName,
    string PhoneNumber,
    string? Email);

public sealed record CustomerListItemDto(
    Guid Id,
    string FullName,
    string PhoneNumber,
    string? Email,
    string? AddressSummary);
