namespace FinalMicroservices.Models;

/// <summary>
/// Database entity for App User
/// </summary>
public sealed class AppUser
{
    public long Id { get; set; }
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "TENANT";
    public long? TenantId { get; set; }
    public bool Enabled { get; set; } = true;

    public AppUserDto ToDto() => new()
    {
        Id = Id,
        Username = Username,
        Password = "",
        FullName = FullName,
        Role = Role,
        TenantId = TenantId,
        Enabled = Enabled
    };
}

/// <summary>
/// Database entity for Room
/// </summary>
public sealed class Room
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public double Area { get; set; }
    public decimal WaterPrice { get; set; }
    public string Status { get; set; } = "AVAILABLE";

    public RoomDto ToDto() => new()
    {
        Id = Id,
        Name = Name,
        Price = Price,
        Area = Area,
        WaterPrice = WaterPrice,
        Status = Status
    };
}

/// <summary>
/// Database entity for Tenant
/// </summary>
public sealed class Tenant
{
    public long Id { get; set; }
    public string CitizenId { get; set; } = "";
    public string FullName { get; set; } = "";
    public DateTime BirthDate { get; set; }
    public DateTime MoveInDate { get; set; }
    public long RoomId { get; set; }
    public Room? Room { get; set; }

    public TenantDto ToDto() => new()
    {
        Id = Id,
        CitizenId = CitizenId,
        FullName = FullName,
        BirthDate = BirthDate.ToString("yyyy-MM-dd"),
        MoveInDate = MoveInDate.ToString("yyyy-MM-dd"),
        Room = Room?.ToDto()
    };
}

/// <summary>
/// Database entity for Invoice
/// </summary>
public sealed class Invoice
{
    public long Id { get; set; }
    public long RoomId { get; set; }
    public long TenantId { get; set; }
    public string InvoiceMonth { get; set; } = "";
    public decimal RoomPrice { get; set; }
    public decimal WaterPrice { get; set; }
    public decimal ElectricityPrice { get; set; }
    public decimal ServicePrice { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "UNPAID";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
    public Room? Room { get; set; }
    public Tenant? Tenant { get; set; }

    public InvoiceDto ToDto() => new()
    {
        Id = Id,
        RoomId = RoomId,
        TenantId = TenantId,
        RoomName = Room?.Name ?? "",
        TenantName = Tenant?.FullName ?? "",
        Month = InvoiceMonth,
        TotalAmount = TotalAmount,
        Status = Status
    };
}

/// <summary>
/// Database entity for Payment
/// </summary>
public sealed class Payment
{
    public long Id { get; set; }
    public long InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    public string? Note { get; set; }
    public Invoice? Invoice { get; set; }
}
