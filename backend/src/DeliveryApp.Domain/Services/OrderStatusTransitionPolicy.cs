using DeliveryApp.Domain.Enums;

namespace DeliveryApp.Domain.Services;

public static class OrderStatusTransitionPolicy
{
    private static readonly IReadOnlyDictionary<OrderStatus, OrderStatus[]> AllowedTransitions =
        new Dictionary<OrderStatus, OrderStatus[]>
        {
            [OrderStatus.Available] = [OrderStatus.Accepted, OrderStatus.Cancelled],
            [OrderStatus.Accepted] = [OrderStatus.PickedUp, OrderStatus.Cancelled],
            [OrderStatus.PickedUp] = [OrderStatus.Delivered, OrderStatus.Cancelled],
            [OrderStatus.Delivered] = [],
            [OrderStatus.Cancelled] = []
        };

    public static IReadOnlyCollection<OrderStatus> GetAllowedNextStatuses(OrderStatus currentStatus) =>
        AllowedTransitions[currentStatus];

    public static bool CanTransition(OrderStatus currentStatus, OrderStatus nextStatus) =>
        AllowedTransitions[currentStatus].Contains(nextStatus);

    public static void EnsureCanTransition(OrderStatus currentStatus, OrderStatus nextStatus)
    {
        if (!CanTransition(currentStatus, nextStatus))
        {
            throw new InvalidOperationException($"Order cannot transition from {currentStatus} to {nextStatus}.");
        }
    }
}
