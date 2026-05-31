using DeliveryApp.Domain.Enums;
using DeliveryApp.Domain.Services;
using FluentAssertions;
using Xunit;

namespace DeliveryApp.Tests;

public sealed class OrderStatusTransitionPolicyTests
{
    [Theory]
    [InlineData(OrderStatus.Available, OrderStatus.Accepted, true)]
    [InlineData(OrderStatus.Available, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Accepted, OrderStatus.PickedUp, true)]
    [InlineData(OrderStatus.PickedUp, OrderStatus.Delivered, true)]
    [InlineData(OrderStatus.Delivered, OrderStatus.Cancelled, false)]
    [InlineData(OrderStatus.Cancelled, OrderStatus.Accepted, false)]
    [InlineData(OrderStatus.Available, OrderStatus.Delivered, false)]
    public void CanTransition_ReturnsExpectedResult(OrderStatus from, OrderStatus to, bool expected)
    {
        OrderStatusTransitionPolicy.CanTransition(from, to).Should().Be(expected);
    }

    [Fact]
    public void EnsureCanTransition_ThrowsForInvalidTransition()
    {
        Action act = () => OrderStatusTransitionPolicy.EnsureCanTransition(OrderStatus.Delivered, OrderStatus.PickedUp);
        act.Should().Throw<InvalidOperationException>();
    }
}
