namespace FinalMicroservices.Models;

public sealed record LoginRequest(string Username, string Password);

public sealed record LoginResponse(
    bool Success,
    string Username,
    string FullName,
    string Role,
    string Message);
