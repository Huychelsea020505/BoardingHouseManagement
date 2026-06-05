using FinalMicroservices.Models;

namespace FinalMicroservices.Facades;

public sealed class AuthFacade
{
    public Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        if (request.Username.Equals("admin", StringComparison.OrdinalIgnoreCase) && request.Password == "123456")
        {
            return Task.FromResult(new LoginResponse(true, "admin", "System Administrator", "ADMIN", "Login successful"));
        }

        if (request.Username.Equals("staff", StringComparison.OrdinalIgnoreCase) && request.Password == "123456")
        {
            return Task.FromResult(new LoginResponse(true, "staff", "Motel Staff", "STAFF", "Login successful"));
        }

        return Task.FromResult(new LoginResponse(false, request.Username, "", "", "Invalid username or password"));
    }
}
