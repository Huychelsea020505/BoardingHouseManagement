# Docker Pre-Flight Checklist

Run this checklist before launching `docker-compose up`:

## ✅ System Requirements

- [ ] Docker Desktop installed: `docker --version`
- [ ] Docker running: `docker ps` (should show no error)
- [ ] At least 15 GB free disk space: `df -h`
- [ ] PowerShell or Git Bash terminal open

## ✅ Port Availability

Run these commands to verify ports are free:

```powershell
# Check all required ports
$ports = 3306, 3307, 3308, 5090, 5173, 8080, 8082
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "❌ Port $port is in use by PID $($process.OwningProcess)"
    } else {
        Write-Host "✅ Port $port is available"
    }
}
```

If any port is in use, stop the process:
```powershell
# Kill process on port (example for 5090)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5090).OwningProcess | Stop-Process -Force
```

## ✅ Project Structure

Verify these files/folders exist:

```
✅ docker-compose.yml
✅ docker/
   ✅ mysql/
      ✅ init/
         ✅ 01-schema-and-demo-data.sql
✅ csharp-services/
   ✅ FinalMicroservices/
      ✅ Dockerfile
      ✅ Program.cs
✅ frontend/
   ✅ Dockerfile
   ✅ package.json
✅ room-service/
   ✅ Dockerfile
   ✅ pom.xml
✅ billing-service/
   ✅ Dockerfile
   ✅ pom.xml
```

## ✅ Project Build Status

```bash
# Test C# build
cd csharp-services/FinalMicroservices
dotnet build
cd ../../

# Test Java builds (optional - happens in Docker)
# cd room-service
# mvn clean compile
# cd ../billing-service
# mvn clean compile
```

## ✅ Configuration Files

Verify content:

- [ ] docker-compose.yml has 7 services
- [ ] appsettings.json exists in FinalMicroservices
- [ ] SQL init script has user data
- [ ] Frontend Dockerfile exists

## ✅ Docker Configuration

```bash
# Verify Docker has enough resources
docker system df  # Should have plenty of space

# Check Docker network
docker network ls  # Should include 'bridge'
```

## ✅ Pre-Launch Commands

```bash
# Clean up old containers (optional but recommended for fresh start)
docker-compose down -v

# Rebuild images fresh
docker-compose up --build

# Expected output should show all 7 services starting
```

## 🚀 Ready to Launch?

If all checkboxes are checked, you're ready:

```bash
cd d:\Software Architecture\Maven\BoardingHouseManagement
docker-compose up
```

Monitor output - you should see:
1. Services building (first time takes 5-10 minutes)
2. MySQL databases initializing
3. Java services starting
4. C# service starting
5. Frontend building and starting

## ⏱️ Expected Timeline

- First run: 8-12 minutes (full build)
- Subsequent runs: 30-60 seconds (just starting containers)
- All services healthy: Watch for "service_healthy" in logs

## 📋 Success Indicators

After `docker-compose up`:

```bash
# In another terminal, check all services running
docker-compose ps

# Expected output (all should show "Up"):
# mysql                  Up  
# room-db                Up  
# billing-db             Up  
# room-service           Up  
# billing-service        Up  
# csharp-service         Up  
# frontend               Up  
```

## 🧪 Quick Verification Tests

```bash
# Test C# API is responding
curl http://localhost:5090/api/users

# Expected: JSON array with user objects
# [{"id":1,"username":"admin","password":"","fullName":"System Administrator",...}]

# Test frontend is accessible
curl http://localhost:5173

# Expected: HTML content
```

## ⚠️ Troubleshooting If Something Fails

```bash
# See full logs
docker-compose logs -f

# Restart just one service
docker-compose restart csharp-service

# Rebuild one service
docker-compose up -d --build csharp-service

# Complete reset
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## ✅ All Set?

Proceed to: [DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md) for detailed usage guide.

---

**Check all boxes before running!**
