using FinalMicroservices.Models;
using FinalMicroservices.Services;

namespace FinalMicroservices.Facades;

public sealed class ReportFacade
{
    private readonly JavaApiClient _javaApiClient;
    private readonly DemoDataStore _demoDataStore;

    public ReportFacade(JavaApiClient javaApiClient, DemoDataStore demoDataStore)
    {
        _javaApiClient = javaApiClient;
        _demoDataStore = demoDataStore;
    }

    public async Task<ReportSummary> GetSummaryAsync()
    {
        var rooms = await _javaApiClient.GetRoomsAsync() ?? _demoDataStore.Rooms;
        var tenants = await _javaApiClient.GetTenantsAsync() ?? _demoDataStore.Tenants;
        var invoices = await _javaApiClient.GetInvoicesAsync() ?? _demoDataStore.Invoices;

        var paidInvoices = invoices.Where(invoice => invoice.Status.Equals("PAID", StringComparison.OrdinalIgnoreCase)).ToList();
        var unpaidInvoices = invoices.Where(invoice => invoice.Status.Equals("UNPAID", StringComparison.OrdinalIgnoreCase)).ToList();

        return new ReportSummary
        {
            TotalRooms = rooms.Count,
            AvailableRooms = rooms.Count(room => room.Status.Equals("AVAILABLE", StringComparison.OrdinalIgnoreCase)),
            OccupiedRooms = rooms.Count(room => room.Status.Equals("OCCUPIED", StringComparison.OrdinalIgnoreCase)),
            MaintenanceRooms = rooms.Count(room => room.Status.Equals("MAINTENANCE", StringComparison.OrdinalIgnoreCase)),
            TotalTenants = tenants.Count,
            UnpaidInvoices = unpaidInvoices.Count,
            TotalRevenue = paidInvoices.Sum(invoice => invoice.TotalAmount),
            RecentUnpaidInvoices = unpaidInvoices.Take(5).ToList()
        };
    }
}
