# User Database Integration Verification Checklist

## ✅ Installation & Build

- [ ] Rebuild the solution: `dotnet build` in csharp-services/FinalMicroservices
- [ ] Verify no compilation errors
- [ ] NuGet packages restored successfully

## ✅ Configuration

- [ ] appsettings.json has ConnectionStrings configured
- [ ] Connection string points to correct MySQL host/port
- [ ] Database name is `boarding_house`
- [ ] MySQL credentials are correct (root/mysql)

## ✅ Docker Deployment

- [ ] Docker Compose file includes MySQL service
- [ ] MySQL initialization script runs: `01-schema-and-demo-data.sql`
- [ ] Network connectivity between containers verified
- [ ] Run: `docker-compose up`

## ✅ API Testing

### Get All Users
```bash
curl http://localhost:5090/api/users
```
Expected: List of users in JSON format with status 200

### Create User (Success)
```bash
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser_'"$(date +%s)"'",
    "password": "password123",
    "fullName": "Test User",
    "role": "TENANT",
    "tenantId": 1
  }'
```
Expected: Status 201 Created with user data

### Create User (Duplicate Username)
```bash
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123",
    "fullName": "Duplicate User",
    "role": "TENANT"
  }'
```
Expected: Status 400 with message "Username 'admin' already exists"

### Get Single User
```bash
curl http://localhost:5090/api/users/1
```
Expected: Status 200 with user details

### Update User
```bash
curl -X PUT http://localhost:5090/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "password": "newpass123",
    "role": "ADMIN"
  }'
```
Expected: Status 200 with updated user data

### Enable/Disable User
```bash
curl -X PUT http://localhost:5090/api/users/1/enabled?enabled=false
```
Expected: Status 200 with user data showing enabled=false

## ✅ Database Verification

### Access MySQL directly
```bash
docker-compose exec mysql mysql -u root -pmysql boarding_house

# Check users table
SELECT id, username, full_name, role, enabled FROM app_user;

# Check for uniqueness constraint on username
SHOW INDEX FROM app_user;
```

## ✅ Error Handling

- [ ] 400 Bad Request returns meaningful error message
- [ ] 404 Not Found when user doesn't exist
- [ ] 500 Server Error shows exception details in development
- [ ] Invalid JSON request returns proper error

## ✅ Frontend Integration

- [ ] Frontend can call GET /api/users
- [ ] Frontend can POST new users
- [ ] Frontend receives duplicate username error gracefully
- [ ] Frontend displays user data correctly

## ✅ Data Persistence

- [ ] Create a test user via API
- [ ] Stop Docker containers: `docker-compose down`
- [ ] Restart: `docker-compose up`
- [ ] Verify test user still exists: GET /api/users
- [ ] ✅ If user exists after restart = SUCCESS

## ✅ Multi-instance Testing (Optional)

- [ ] Scale C# service: `docker-compose up --scale api=3`
- [ ] All instances can access same database
- [ ] Load balancing works correctly

## 📋 Troubleshooting Checklist

If tests fail:
- [ ] Check MySQL logs: `docker-compose logs mysql`
- [ ] Check API logs: `docker-compose logs api`
- [ ] Verify network: `docker network ls`
- [ ] Reset database: Remove MySQL volume and restart
- [ ] Check connection string format
- [ ] Verify MySQL port 3306 is exposed

## 🎯 Final Sign-off

- [ ] All API endpoints working
- [ ] Data persists across restarts
- [ ] No duplicate username errors for different names
- [ ] Frontend successfully creates/reads users
- [ ] Docker deployment successful
- [ ] Ready for production deployment

---
**Status**: Ready for verification
