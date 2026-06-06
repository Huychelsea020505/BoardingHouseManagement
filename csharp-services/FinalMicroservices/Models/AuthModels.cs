namespace FinalMicroservices.Models;

public sealed record LoginRequest(string Username, string Password);

public sealed record LoginResponse(
    bool Success,
    string Username,
    string FullName,
    string Role,
    long? TenantId,
    string Message);

public sealed class AppUserDto
{
    public long Id { get; set; }
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "TENANT";
    public long? TenantId { get; set; }
    public string TenantName { get; set; } = "";
    public bool Enabled { get; set; } = true;
}
