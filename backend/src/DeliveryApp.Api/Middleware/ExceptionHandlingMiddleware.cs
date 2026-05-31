using System.Text.Json;
using DeliveryApp.Application.Common;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace DeliveryApp.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = context.TraceIdentifier;
        var (statusCode, error) = exception switch
        {
            AppException appException => (appException.StatusCode, new ApiError(appException.Code, appException.Message, appException.Details)),
            DbUpdateConcurrencyException => (StatusCodes.Status409Conflict, new ApiError("CONFLICT", "The requested operation conflicted with another update. Please retry.")),
            DbUpdateException dbUpdateException when IsTransient(dbUpdateException) => (StatusCodes.Status503ServiceUnavailable, new ApiError("TRANSIENT_ERROR", "The database is temporarily unavailable. Please retry shortly.")),
            OperationCanceledException => (499, new ApiError("REQUEST_CANCELLED", "The request was cancelled.")),
            _ => (StatusCodes.Status500InternalServerError, new ApiError("UNEXPECTED_ERROR", "An unexpected server error occurred."))
        };

        if (statusCode >= 500)
        {
            _logger.LogError(exception, "Unhandled error. TraceId: {TraceId}", traceId);
        }
        else
        {
            _logger.LogWarning(exception, "Handled application error. TraceId: {TraceId}", traceId);
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new ErrorResponse(error, traceId), JsonOptions.Default));
    }

    private static bool IsTransient(DbUpdateException exception) =>
        exception.InnerException is PostgresException postgresException &&
        postgresException.SqlState is "40001" or "40P01" or "53300" or "57P01" or "57P02" or "57P03";
}

internal static class JsonOptions
{
    public static readonly JsonSerializerOptions Default = new(JsonSerializerDefaults.Web);
}
