using FinalMicroservices.Models;
using FinalMicroservices.Services;

namespace FinalMicroservices.Facades;

public sealed class SearchFacade
{
    private readonly JavaApiClient _javaApiClient;
    private readonly DemoDataStore _demoDataStore;

    public SearchFacade(JavaApiClient javaApiClient, DemoDataStore demoDataStore)
    {
        _javaApiClient = javaApiClient;
        _demoDataStore = demoDataStore;
    }

    public async Task<IReadOnlyList<RoomDto>> SearchRoomsAsync(string? keyword, string? status)
    {
        var rooms = await _javaApiClient.GetRoomsAsync() ?? _demoDataStore.Rooms;
        return rooms
            .Where(room => Matches(room.Name, keyword) && MatchesExact(room.Status, status))
            .ToList();
    }

    public async Task<IReadOnlyList<TenantDto>> SearchTenantsAsync(string? keyword, long? roomId)
    {
        var tenants = await _javaApiClient.GetTenantsAsync() ?? _demoDataStore.Tenants;
        return tenants
            .Where(tenant =>
                (Matches(tenant.FullName, keyword) || Matches(tenant.CitizenId, keyword) || Matches(tenant.Room?.Name, keyword)) &&
                (!roomId.HasValue || tenant.Room?.Id == roomId.Value))
            .ToList();
    }

    public async Task<IReadOnlyList<InvoiceDto>> SearchInvoicesAsync(string? keyword, string? status, long? tenantId)
    {
        var invoices = await _javaApiClient.GetInvoicesAsync() ?? _demoDataStore.Invoices;
        return invoices
            .Where(invoice =>
                (Matches(invoice.RoomName, keyword) || Matches(invoice.TenantName, keyword) || Matches(invoice.Month, keyword)) &&
                MatchesExact(invoice.Status, status) &&
                (!tenantId.HasValue || invoice.TenantId == tenantId.Value))
            .ToList();
    }

    private static bool Matches(string? value, string? keyword) =>
        string.IsNullOrWhiteSpace(keyword) ||
        (value?.Contains(keyword, StringComparison.OrdinalIgnoreCase) ?? false);

    private static bool MatchesExact(string? value, string? expected) =>
        string.IsNullOrWhiteSpace(expected) ||
        expected.Equals("ALL", StringComparison.OrdinalIgnoreCase) ||
        value?.Equals(expected, StringComparison.OrdinalIgnoreCase) == true;
}
