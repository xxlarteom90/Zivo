namespace DeliveryApp.Application.Interfaces;

public interface IUserContext
{
    bool IsAuthenticated { get; }
    Guid UserId { get; }
    string Email { get; }
    IReadOnlyCollection<string> Roles { get; }
    bool IsInRole(string role);
}
