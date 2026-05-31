namespace DeliveryApp.Application.Common;

public sealed record ApiError(string Code, string Message, IReadOnlyCollection<string>? Details = null);
