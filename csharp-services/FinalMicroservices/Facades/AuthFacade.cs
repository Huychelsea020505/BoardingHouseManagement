using FinalMicroservices.Models;
using FinalMicroservices.Services;

namespace FinalMicroservices.Facades;

public sealed class AuthFacade
{
    private readonly DemoDataStore _demoDataStore;

    public AuthFacade(DemoDataStore demoDataStore)
    {
        _demoDataStore = demoDataStore;
    }

    public Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = _demoDataStore.Users.FirstOrDefault(item =>
            item.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase) &&
            item.Password == request.Password &&
            item.Enabled);

        if (user is null)
        {
            return Task.FromResult(new LoginResponse(false, request.Username, "", "", null, "Invalid username or password"));
        }

        return Task.FromResult(new LoginResponse(true, user.Username, user.FullName, user.Role, user.TenantId, "Login successful"));
    }
}
