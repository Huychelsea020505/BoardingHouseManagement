namespace FinalMicroservices.Models;

public sealed class RoomDto
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public double Area { get; set; }
    public decimal WaterPrice { get; set; }
    public string Status { get; set; } = "AVAILABLE";
}

public sealed class TenantDto
{
    public long Id { get; set; }
    public string CitizenId { get; set; } = "";
    public string FullName { get; set; } = "";
    public string BirthDate { get; set; } = "";
    public string MoveInDate { get; set; } = "";
    public RoomDto? Room { get; set; }
}

public sealed class InvoiceDto
{
    public long Id { get; set; }
    public long RoomId { get; set; }
    public long TenantId { get; set; }
    public string RoomName { get; set; } = "";
    public string TenantName { get; set; } = "";
    public string Month { get; set; } = "";
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "UNPAID";
}

public sealed class ReportSummary
{
    public int TotalRooms { get; set; }
    public int AvailableRooms { get; set; }
    public int OccupiedRooms { get; set; }
    public int MaintenanceRooms { get; set; }
    public int TotalTenants { get; set; }
    public int UnpaidInvoices { get; set; }
    public decimal TotalRevenue { get; set; }
    public IReadOnlyList<InvoiceDto> RecentUnpaidInvoices { get; set; } = Array.Empty<InvoiceDto>();
}
