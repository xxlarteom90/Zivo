namespace DeliveryApp.Application.Common;

public abstract class AppException : Exception
{
    protected AppException(string code, string message, int statusCode, IReadOnlyCollection<string>? details = null)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
        Details = details ?? Array.Empty<string>();
    }

    public string Code { get; }
    public int StatusCode { get; }
    public IReadOnlyCollection<string> Details { get; }
}

public sealed class ValidationAppException : AppException
{
    public ValidationAppException(string message, IReadOnlyCollection<string>? details = null)
        : base("VALIDATION_ERROR", message, StatusCodes.Status400BadRequest, details) { }
}

public sealed class AuthenticationAppException : AppException
{
    public AuthenticationAppException(string message = "Authentication failed.")
        : base("AUTHENTICATION_ERROR", message, StatusCodes.Status401Unauthorized) { }
}

public sealed class ForbiddenAppException : AppException
{
    public ForbiddenAppException(string message = "You do not have permission to perform this action.")
        : base("AUTHORIZATION_ERROR", message, StatusCodes.Status403Forbidden) { }
}

public sealed class NotFoundAppException : AppException
{
    public NotFoundAppException(string resourceName, object key)
        : base("NOT_FOUND", $"{resourceName} with key '{key}' was not found.", StatusCodes.Status404NotFound) { }
}

public sealed class ConflictAppException : AppException
{
    public ConflictAppException(string message)
        : base("CONFLICT", message, StatusCodes.Status409Conflict) { }
}

public sealed class TransientAppException : AppException
{
    public TransientAppException(string message)
        : base("TRANSIENT_ERROR", message, StatusCodes.Status503ServiceUnavailable) { }
}

internal static class StatusCodes
{
    public const int Status400BadRequest = 400;
    public const int Status401Unauthorized = 401;
    public const int Status403Forbidden = 403;
    public const int Status404NotFound = 404;
    public const int Status409Conflict = 409;
    public const int Status503ServiceUnavailable = 503;
}
