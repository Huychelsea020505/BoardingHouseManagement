using System.Text.Json;
using FinalMicroservices.Models;

namespace FinalMicroservices.Services;

public sealed class JavaApiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public JavaApiClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public Task<IReadOnlyList<RoomDto>?> GetRoomsAsync() =>
        GetAsync<IReadOnlyList<RoomDto>>($"{RoomBaseUrl}/rooms");

    public Task<IReadOnlyList<TenantDto>?> GetTenantsAsync() =>
        GetAsync<IReadOnlyList<TenantDto>>($"{RoomBaseUrl}/tenants");

    public Task<IReadOnlyList<InvoiceDto>?> GetInvoicesAsync() =>
        GetAsync<IReadOnlyList<InvoiceDto>>($"{BillingBaseUrl}/invoices");

    private string RoomBaseUrl => _configuration["JavaServices:RoomBaseUrl"] ?? "http://localhost:8080";

    private string BillingBaseUrl => _configuration["JavaServices:BillingBaseUrl"] ?? "http://localhost:8082";

    private async Task<T?> GetAsync<T>(string url)
    {
        try
        {
            using var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                return default;
            }

            await using var stream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions);
        }
        catch
        {
            return default;
        }
    }
}
