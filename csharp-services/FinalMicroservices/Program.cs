using FinalMicroservices.Facades;
using FinalMicroservices.Models;
using FinalMicroservices.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddHttpClient<JavaApiClient>();
builder.Services.AddSingleton<DemoDataStore>();
builder.Services.AddScoped<AuthFacade>();
builder.Services.AddScoped<SearchFacade>();
builder.Services.AddScoped<ReportFacade>();

var app = builder.Build();

app.UseCors("Frontend");

app.MapGet("/", () => Results.Ok(new
{
    service = "Boarding House Final Microservices",
    apis = new[] { "/api/sso/login", "/api/search/rooms", "/api/search/tenants", "/api/search/invoices", "/api/reports/summary" }
}));

app.MapPost("/api/sso/login", async (LoginRequest request, AuthFacade facade) =>
{
    var response = await facade.LoginAsync(request);
    return response.Success ? Results.Ok(response) : Results.Unauthorized();
});

app.MapGet("/api/search/rooms", async (string? keyword, string? status, SearchFacade facade) =>
    Results.Ok(await facade.SearchRoomsAsync(keyword, status)));

app.MapGet("/api/search/tenants", async (string? keyword, long? roomId, SearchFacade facade) =>
    Results.Ok(await facade.SearchTenantsAsync(keyword, roomId)));

app.MapGet("/api/search/invoices", async (string? keyword, string? status, SearchFacade facade) =>
    Results.Ok(await facade.SearchInvoicesAsync(keyword, status)));

app.MapGet("/api/reports/summary", async (ReportFacade facade) =>
    Results.Ok(await facade.GetSummaryAsync()));

app.Run("http://localhost:5090");
