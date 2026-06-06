# Docker Setup Guide - Boarding House Management System

## 📋 Complete Docker Compose Setup

Your project now has a complete Docker setup with:

1. **3 MySQL Databases**
   - `mysql` (port 3306) - For C# microservice & general data
   - `room-db` (port 3307) - For Java Room Service
   - `billing-db` (port 3308) - For Java Billing Service

2. **Java Microservices**
   - Room Service (port 8080)
   - Billing Service (port 8082)

3. **C# Microservice**
   - FinalMicroservices (port 5090) - User, Search, Auth, Report APIs

4. **Frontend**
   - React + Vite (port 5173)

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- 15+ GB free disk space
- Ports 3306, 3307, 3308, 5090, 5173, 8080, 8082 available

### Build and Run

```bash
# Navigate to project root
cd d:\Software Architecture\Maven\BoardingHouseManagement

# Build and start all services
docker-compose up --build

# First run may take 5-10 minutes to build all images
```

### Check Services Status

```bash
# In another terminal
docker-compose ps

# Should show all 7 services as "Up"
```

## 📊 Default Demo Data

### Users (in MySQL & DemoDataStore)
| Username | Password | Role | Notes |
|----------|----------|------|-------|
| admin | 123456 | ADMIN | System Administrator |
| staff | 123456 | ADMIN | Motel Staff |
| tenant | 123456 | TENANT | Sample Tenant |
| huy | 123456 | TENANT | Additional Tenant |

### Rooms
- A101 (Occupied) - 2,500,000 VND
- A102 (Available) - 2,300,000 VND
- B201 (Occupied) - 3,000,000 VND
- C301 (Maintenance) - 2,800,000 VND

### Tenants
- Nguyen Van An - Room A101
- Tran Thi Binh - Room B201

## 🌐 API Endpoints

### C# Microservice (http://localhost:5090)

```bash
# Get all users
curl http://localhost:5090/api/users

# Login
curl -X POST http://localhost:5090/api/sso/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# Create new user
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "password":"pass123",
    "fullName":"New User",
    "role":"TENANT",
    "tenantId":1
  }'

# Search rooms
curl http://localhost:5090/api/search/rooms?status=AVAILABLE

# Search tenants
curl http://localhost:5090/api/search/tenants?keyword=An

# Get report summary
curl http://localhost:5090/api/reports/summary
```

### Java Services (Room & Billing)
- Room Service: http://localhost:8080
- Billing Service: http://localhost:8082

### Frontend
- Access at: http://localhost:5173

## 🛠️ Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f csharp-service
docker-compose logs -f room-service
docker-compose logs -f mysql
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (careful - deletes data!)
docker-compose down -v
```

### Restart a Service
```bash
docker-compose restart csharp-service
```

### Access MySQL directly
```bash
# Connect to main MySQL database
docker-compose exec mysql mysql -u root -proot boarding_house

# Check users table
SELECT id, username, full_name FROM app_user;

# Exit MySQL
\exit
```

## 📱 Testing User Management

### Create User via Frontend
1. Open http://localhost:5173
2. Go to Users/Management section
3. Click "Add New User"
4. Fill in: username, password, full name, role
5. Click Save - user should appear in list

### Test User Persistence
```bash
# Create a test user
curl -X POST http://localhost:5090/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser_'$(date +%s)'",
    "password":"test123",
    "fullName":"Test User",
    "role":"ADMIN"
  }'

# View all users
curl http://localhost:5090/api/users

# Get user by ID
curl http://localhost:5090/api/users/1
```

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Find process using port 5090
netstat -ano | findstr :5090

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Docker Build Fails
```bash
# Clean build cache
docker-compose build --no-cache

# Or completely rebuild from scratch
docker system prune -a
docker-compose up --build
```

### Database Connection Error
```bash
# Check database is healthy
docker-compose ps

# If not healthy, restart it
docker-compose restart mysql

# Wait 30 seconds then restart C# service
docker-compose restart csharp-service
```

### Users Endpoint Returns Empty
1. Check C# service is running: `docker-compose logs csharp-service`
2. Check DemoDataStore is initialized
3. Try accessing: `curl http://localhost:5090/api/users`
4. Users should be loaded from DemoDataStore in memory

## 📁 Docker Configuration Files

- `docker-compose.yml` - Main configuration
- `csharp-services/FinalMicroservices/Dockerfile` - C# app
- `frontend/Dockerfile` - React app
- `room-service/Dockerfile` - Room Java service
- `billing-service/Dockerfile` - Billing Java service
- `docker/mysql/init/01-schema-and-demo-data.sql` - Database initialization

## 🔄 Data Persistence

| Component | Persistence | Location |
|-----------|-------------|----------|
| MySQL Data | ✅ Persisted | Docker volume `mysql_data` |
| Users (C#) | 🔄 Memory only | Lost on restart* |
| Rooms | ✅ MySQL | room-db |
| Tenants | ✅ MySQL | mysql |
| Invoices | ✅ MySQL | mysql |

*Note: C# service uses in-memory DemoDataStore. New users created via API will be lost when container restarts. To persist user data, implement database integration.

## 🔐 Security Notes

- Passwords stored in plain text (development only!)
- Default credentials are hardcoded in SQL script
- Use environment variables for production
- Implement password hashing before production deployment

## 📞 Network Configuration

All services communicate via `boarding-network` bridge network:
- Services can reach each other by container name
- Frontend at `http://csharp-service:5090` (inside Docker)
- Frontend at `http://localhost:5090` (from host)

## 🎯 Next Steps

1. Verify all 7 containers are running: `docker-compose ps`
2. Access frontend: http://localhost:5173
3. Test user login with admin/123456
4. Create new users and verify they appear in the list
5. Try other features (search, reports, etc.)

---

**Status**: ✅ Complete Docker setup ready for full deployment
