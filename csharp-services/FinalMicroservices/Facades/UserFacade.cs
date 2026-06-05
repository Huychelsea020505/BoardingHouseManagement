using FinalMicroservices.Models;
using FinalMicroservices.Services;

namespace FinalMicroservices.Facades;

public sealed class UserFacade
{
    private readonly DemoDataStore _demoDataStore;

    public UserFacade(DemoDataStore demoDataStore)
    {
        _demoDataStore = demoDataStore;
    }

    public IReadOnlyList<AppUserDto> GetUsers() =>
        _demoDataStore.Users
            .OrderBy(user => user.Id)
            .Select(SafeUser)
            .ToList();

    public AppUserDto CreateUser(AppUserDto request)
    {
        if (_demoDataStore.Users.Any(user => user.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Username already exists");
        }

        request.Enabled = true;
        request.Role = NormalizeRole(request.Role);
        return SafeUser(_demoDataStore.AddUser(request));
    }

    public AppUserDto UpdateUser(long id, AppUserDto request)
    {
        var user = FindUser(id);
        user.FullName = request.FullName;
        user.Role = NormalizeRole(request.Role);
        user.TenantId = user.Role == "TENANT" ? request.TenantId : null;
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = request.Password;
        }
        return SafeUser(user);
    }

    public AppUserDto SetEnabled(long id, bool enabled)
    {
        var user = FindUser(id);
        user.Enabled = enabled;
        return SafeUser(user);
    }

    private AppUserDto FindUser(long id) =>
        _demoDataStore.Users.FirstOrDefault(user => user.Id == id) ??
        throw new KeyNotFoundException("User not found");

    private static string NormalizeRole(string? role) =>
        role?.Equals("ADMIN", StringComparison.OrdinalIgnoreCase) == true ? "ADMIN" : "TENANT";

    private static AppUserDto SafeUser(AppUserDto user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Password = "",
        FullName = user.FullName,
        Role = user.Role,
        TenantId = user.TenantId,
        Enabled = user.Enabled
    };
}
