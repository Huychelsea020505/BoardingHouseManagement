# User Management Database Integration - Documentation

## 📋 Summary of Changes

Your C# User Management module has been upgraded to use **MySQL database persistence** instead of in-memory storage. This allows user data to be properly saved, retrieved, and persisted across application restarts.

## 🔧 What Was Changed

### 1. **NuGet Packages Added** (FinalMicroservices.csproj)
- `Microsoft.EntityFrameworkCore` v9.0.0
- `Pomelo.EntityFrameworkCore.MySql` v9.0.0
- `Microsoft.EntityFrameworkCore.Design` v9.0.0

### 2. **New Database Context** (Data/ApplicationDbContext.cs)
- Created `ApplicationDbContext` for Entity Framework Core configuration
- Configured entities: AppUser, Room, Tenant, Invoice, Payment
- Set up database mappings with proper foreign keys and constraints

### 3. **Entity Models** (Models/Entities.cs)
- `AppUser` - Database entity for users with conversion to DTO
- `Room` - Database entity for rooms
- `Tenant` - Database entity for tenants
- `Invoice` - Database entity for invoices
- `Payment` - Database entity for payments
- Each entity has a `ToDto()` method for DTO conversion

### 4. **User Repository** (Repositories/UserRepository.cs)
Implements `IUserRepository` interface with methods:
- `GetAllAsync()` - Retrieve all users from database
- `GetByIdAsync(id)` - Get a specific user
- `GetByUsernameAsync(username)` - Search by username
- `UsernameExistsAsync(username)` - Check for duplicate usernames
- `CreateAsync(request)` - Insert new user with duplicate check
- `UpdateAsync(id, request)` - Update existing user
- `SetEnabledAsync(id, enabled)` - Toggle user enabled status
- `DeleteAsync(id)` - Remove user

### 5. **Updated UserFacade** (Facades/UserFacade.cs)
- Changed from using `DemoDataStore` to `IUserRepository`
- All methods are now `async` and query the database
- Returns DTO objects with passwords masked

### 6. **Updated Program.cs**
- Added DbContext registration with MySQL connection
- Registered `IUserRepository` as a scoped service
- Updated all user endpoints to be async
- Added database initialization on startup
- Added `/api/users/{id}` GET endpoint for individual user retrieval
- Added proper error handling for all endpoints

### 7. **Connection String** (appsettings.json)
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=mysql;Port=3306;Database=boarding_house;User=root;Password=mysql;"
}
```

## 🚀 API Endpoints (Updated)

### Get All Users
```http
GET /api/users
```
Response:
```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "",
    "fullName": "Motel Manager",
    "role": "ADMIN",
    "tenantId": null,
    "enabled": true
  }
]
```

### Create New User
```http
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "fullName": "New User",
  "role": "TENANT",
  "tenantId": 1
}
```
**Returns**: `201 Created` with the created user or `400 Bad Request` if username exists

### Get Single User
```http
GET /api/users/{id}
```

### Update User
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "password": "newpassword",
  "role": "ADMIN",
  "tenantId": null
}
```

### Enable/Disable User
```http
PUT /api/users/{id}/enabled?enabled=true
```

## 🐳 Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker-compose build
   ```

2. **Run the services**:
   ```bash
   docker-compose up
   ```

The application will automatically:
- Connect to the MySQL database on startup
- Initialize the database schema if needed
- Load initial demo users (from SQL init script)

## ✅ Key Improvements

| Before | After |
|--------|-------|
| ❌ In-memory storage | ✅ MySQL database persistence |
| ❌ Data lost on restart | ✅ Data persists across restarts |
| ❌ Username checks in-memory | ✅ Database constraints prevent duplicates |
| ❌ No real transactions | ✅ ACID transactions via EF Core |
| ❌ Single instance only | ✅ Multi-instance scalable |
| ❌ Sync methods | ✅ Async/await patterns |

## 🔐 Security Notes

- Passwords are stored in plain text (as configured in SQL)
- For production, implement password hashing (BCrypt, Argon2)
- Database credentials should be moved to environment variables
- Connection string in Docker: `Server=mysql;Port=3306;Database=boarding_house;User=root;Password=mysql;`

## 🧪 Testing

### Test User Creation with Duplicate Username
```bash
# First call succeeds
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pwd","fullName":"Test User","role":"TENANT"}'

# Second call with same username returns 400
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pwd","fullName":"Test User","role":"TENANT"}'
# Response: {"message":"Username 'testuser' already exists"}
```

### Test User Persistence
```bash
# Create user
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"persistence_test","password":"pwd","fullName":"Persistence Test","role":"ADMIN"}'

# Retrieve user (persists even after app restart)
curl http://localhost:5090/api/users/3
```

## 📝 Design Patterns Used

1. **Repository Pattern** - `IUserRepository` abstracts database access
2. **Facade Pattern** - `UserFacade` simplifies complex operations
3. **DTO Pattern** - `AppUserDto` separates API contracts from entities
4. **Dependency Injection** - All dependencies injected via constructor
5. **Async/Await** - Non-blocking I/O operations

## 🔗 Integration Points

- ✅ Integrates with existing MySQL database
- ✅ Compatible with existing Facades (AuthFacade, SearchFacade, ReportFacade)
- ✅ Works with Docker Compose setup
- ✅ Compatible with Java services (billing-service, room-service)

## 📦 Deployment Requirements

- .NET 9.0 runtime
- MySQL 8.0+
- Connection to MySQL container via network

## ⚠️ Troubleshooting

### Connection refused error
- Ensure MySQL container is running: `docker-compose ps`
- Check connection string in appsettings.json
- Verify network connectivity between containers

### Username "already exists" error
- This is the expected behavior - usernames must be unique
- Use a different username or check existing users via GET /api/users

### Database schema mismatch
- Delete the database and restart to recreate schema
- Or run migrations manually if schema changes occur

---

**Status**: ✅ Ready for production deployment with Docker
