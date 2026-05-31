namespace DeliveryApp.Application.Common;

public sealed record ApiResponse<T>(T? Data, string TraceId)
{
    public static ApiResponse<T> Success(T data, string traceId) => new(data, traceId);
}

public sealed record ErrorResponse(ApiError Error, string TraceId);
