using DeliveryApp.Application.Common;
using DeliveryApp.Application.Customers;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.DispatcherOrAdmin)]
[Route("api/customers")]
public sealed class CustomersController : ApiControllerBase
{
    private readonly IApplicationDbContext _dbContext;

    public CustomersController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<CustomerListItemDto>>>> GetCustomers(CancellationToken cancellationToken)
    {
        var customers = await _dbContext.Customers
            .AsNoTracking()
            .Include(customer => customer.DefaultAddress)
            .OrderBy(customer => customer.FullName)
            .Select(customer => new CustomerListItemDto(
                customer.Id,
                customer.FullName,
                customer.PhoneNumber,
                customer.Email,
                customer.DefaultAddress == null ? null : customer.DefaultAddress.Line1 + ", " + customer.DefaultAddress.City))
            .ToListAsync(cancellationToken);

        return Envelope<IReadOnlyCollection<CustomerListItemDto>>(customers);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CustomerListItemDto>>> CreateCustomer(CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var address = request.DefaultAddress is null ? null : new Address
        {
            Line1 = request.DefaultAddress.Line1.Trim(),
            Line2 = request.DefaultAddress.Line2?.Trim(),
            City = request.DefaultAddress.City.Trim(),
            CountyOrRegion = request.DefaultAddress.CountyOrRegion?.Trim(),
            PostalCode = request.DefaultAddress.PostalCode?.Trim(),
            Country = request.DefaultAddress.Country.Trim(),
            Latitude = request.DefaultAddress.Latitude,
            Longitude = request.DefaultAddress.Longitude
        };

        var customer = new Customer
        {
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Email = request.Email?.Trim(),
            DefaultAddress = address,
            Notes = request.Notes?.Trim()
        };

        _dbContext.Customers.Add(customer);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var dto = new CustomerListItemDto(customer.Id, customer.FullName, customer.PhoneNumber, customer.Email, address?.ToSingleLine());
        return CreatedAtAction(nameof(GetCustomers), ApiResponse<CustomerListItemDto>.Success(dto, HttpContext.TraceIdentifier));
    }
}

public sealed record CreateCustomerRequest(string FullName, string PhoneNumber, string? Email, CreateAddressDto? DefaultAddress, string? Notes);
