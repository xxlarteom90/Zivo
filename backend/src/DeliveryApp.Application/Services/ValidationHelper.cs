using DeliveryApp.Application.Common;

namespace DeliveryApp.Application.Services;

internal static class ValidationHelper
{
    public static void EnsureNoErrors(IReadOnlyCollection<string> errors)
    {
        if (errors.Count > 0)
        {
            throw new ValidationAppException("One or more validation errors occurred.", errors);
        }
    }

    public static string RequireTrimmed(string? value, string fieldName, ICollection<string> errors, int maxLength = 4000)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors.Add($"{fieldName} is required.");
            return string.Empty;
        }

        var trimmed = value.Trim();
        if (trimmed.Length > maxLength)
        {
            errors.Add($"{fieldName} must be {maxLength} characters or fewer.");
        }

        return trimmed;
    }
}
