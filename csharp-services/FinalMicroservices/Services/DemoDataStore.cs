using FinalMicroservices.Models;

namespace FinalMicroservices.Services;

public sealed class DemoDataStore
{
    public IReadOnlyList<RoomDto> Rooms { get; } =
    [
        new() { Id = 1, Name = "A101", Price = 2500000, Area = 20, WaterPrice = 15000, Status = "OCCUPIED" },
        new() { Id = 2, Name = "A102", Price = 2300000, Area = 18, WaterPrice = 15000, Status = "AVAILABLE" },
        new() { Id = 3, Name = "B201", Price = 3000000, Area = 25, WaterPrice = 18000, Status = "OCCUPIED" }
    ];

    public IReadOnlyList<TenantDto> Tenants { get; }

    public IReadOnlyList<InvoiceDto> Invoices { get; } =
    [
        new() { Id = 1, RoomId = 1, TenantId = 1, RoomName = "A101", TenantName = "Nguyen Van An", Month = "05/2026", TotalAmount = 3020000, Status = "UNPAID" },
        new() { Id = 2, RoomId = 3, TenantId = 2, RoomName = "B201", TenantName = "Tran Thi Binh", Month = "04/2026", TotalAmount = 3620000, Status = "PAID" }
    ];

    public DemoDataStore()
    {
        Tenants =
        [
            new() { Id = 1, CitizenId = "079201000001", FullName = "Nguyen Van An", BirthDate = "2001-04-12", MoveInDate = "2026-01-10", Room = Rooms[0] },
            new() { Id = 2, CitizenId = "079202000002", FullName = "Tran Thi Binh", BirthDate = "2002-08-20", MoveInDate = "2026-02-15", Room = Rooms[2] }
        ];
    }
}
