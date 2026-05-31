using DeliveryApp.Application.Common;
using DeliveryApp.Application.Interfaces;
using DeliveryApp.Application.PartnerBusinesses;
using DeliveryApp.Domain.Entities;
using DeliveryApp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryApp.Api.Controllers;

[Authorize(Roles = ApiRoles.DispatcherOrAdmin)]
[Route("api/partner-businesses")]
public sealed class PartnerBusinessesController : ApiControllerBase
{
    private readonly IApplicationDbContext _dbContext;

    public PartnerBusinessesController(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<PartnerBusinessListItemDto>>>> GetPartnerBusinesses(CancellationToken cancellationToken)
    {
        var partners = await _dbContext.PartnerBusinesses
            .AsNoTracking()
            .Include(partner => partner.Address)
            .OrderBy(partner => partner.Name)
            .Select(partner => new PartnerBusinessListItemDto(
                partner.Id,
                partner.Name,
                partner.BusinessType.ToString(),
                partner.PhoneNumber,
                partner.Email,
                partner.IsActive,
                partner.Address.Line1 + ", " + partner.Address.City))
            .ToListAsync(cancellationToken);

        return Envelope<IReadOnlyCollection<PartnerBusinessListItemDto>>(partners);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PartnerBusinessListItemDto>>> CreatePartner(CreatePartnerBusinessRequest request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<PartnerBusinessType>(request.BusinessType, true, out var type))
        {
            throw new ValidationAppException("Invalid partner business type.", ["BusinessType must be one of: CarpetCleaning, PillowCleaning, Laundry, DryCleaning, UpholsteryCleaning, Other."]);
        }

        var address = new Address
        {
            Line1 = request.Address.Line1.Trim(),
            Line2 = request.Address.Line2?.Trim(),
            City = request.Address.City.Trim(),
            CountyOrRegion = request.Address.CountyOrRegion?.Trim(),
            PostalCode = request.Address.PostalCode?.Trim(),
            Country = request.Address.Country.Trim(),
            Latitude = request.Address.Latitude,
            Longitude = request.Address.Longitude
        };

        var partner = new PartnerBusiness
        {
            Name = request.Name.Trim(),
            BusinessType = type,
            ContactName = request.ContactName?.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Email = request.Email?.Trim(),
            Address = address,
            Notes = request.Notes?.Trim(),
            IsActive = true
        };

        _dbContext.PartnerBusinesses.Add(partner);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var dto = new PartnerBusinessListItemDto(partner.Id, partner.Name, partner.BusinessType.ToString(), partner.PhoneNumber, partner.Email, partner.IsActive, address.ToSingleLine());
        return CreatedAtAction(nameof(GetPartnerBusinesses), ApiResponse<PartnerBusinessListItemDto>.Success(dto, HttpContext.TraceIdentifier));
    }
}

public sealed record CreatePartnerBusinessRequest(
    string Name,
    string BusinessType,
    string? ContactName,
    string PhoneNumber,
    string? Email,
    CreateAddressDto Address,
    string? Notes);
