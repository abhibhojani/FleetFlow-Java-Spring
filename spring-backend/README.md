# FleetFlow – Spring Boot Backend

A complete Java Spring Boot migration of the original Node.js/Express backend.
All original REST API endpoints are preserved with identical paths and response shapes.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.3 |
| Language | Java 17 |
| Database | MongoDB (via Spring Data MongoDB) |
| Auth | JWT (jjwt 0.12) + BCrypt |
| Security | Spring Security 6 |
| Boilerplate reduction | Lombok |

## Project Structure

```
spring-backend/
├── pom.xml
├── mvnw.cmd                              ← Run without global Maven
└── src/main/java/com/fleetflow/
    ├── FleetFlowApplication.java         ← Entry point
    ├── config/
    │   └── MongoConfig.java              ← Enables @CreatedDate auditing
    ├── security/
    │   ├── JwtUtils.java                 ← Token generation & validation
    │   ├── JwtAuthenticationFilter.java  ← Per-request JWT check
    │   └── SecurityConfig.java           ← CORS + Stateless session
    ├── model/
    │   ├── User.java
    │   ├── Driver.java
    │   ├── Vehicle.java
    │   ├── MaintenanceLog.java
    │   └── ExpenseLog.java
    ├── repository/                       ← MongoRepository interfaces
    ├── dto/
    │   ├── RegisterRequest.java
    │   ├── LoginRequest.java
    │   └── AuthResponse.java
    └── controller/
        ├── HealthController.java         ← GET /api/health
        ├── AuthController.java           ← POST /api/auth/register|login
        ├── VehicleController.java        ← GET/POST/PUT/DELETE /api/vehicles
        ├── DriverController.java         ← GET/POST/PUT/DELETE /api/drivers
        ├── MaintenanceController.java    ← GET/POST/PUT /api/maintenance
        └── ExpenseController.java        ← GET/POST/PUT/DELETE /api/expenses
```

## API Endpoints (identical to original Node.js backend)

| Method | Path | Description |
|---|---|---|
| GET | /api/health | Health check |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/vehicles | List all vehicles |
| POST | /api/vehicles | Add vehicle |
| PUT | /api/vehicles/:id | Update vehicle |
| DELETE | /api/vehicles/:id | Delete vehicle |
| GET | /api/drivers | List all drivers |
| POST | /api/drivers | Add driver |
| PUT | /api/drivers/:id | Update driver |
| DELETE | /api/drivers/:id | Delete driver |
| GET | /api/maintenance | List all maintenance logs |
| POST | /api/maintenance | Add maintenance log |
| PUT | /api/maintenance/:id | Update maintenance log |
| GET | /api/expenses | List all expense logs |
| POST | /api/expenses | Add expense log |
| PUT | /api/expenses/:id | Update expense log |
| DELETE | /api/expenses/:id | Delete expense log |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| MONGO_URI | mongodb://localhost:27017/fleetflow | MongoDB connection string |
| JWT_SECRET | super-secret-key-change-me-... | JWT signing secret (change in production!) |

## Running Locally

### Prerequisites
- Java 17+ (you already have Java 22 ✅)
- Maven 3.6+ **OR** use the included Maven Wrapper (no global Maven needed)
- MongoDB running locally or a MongoDB Atlas URI

### Step 1: Install Maven (if not already)
```powershell
# Option A – Download Maven directly
# https://maven.apache.org/download.cgi
# Then add to PATH

# Option B – Use SDKMAN (WSL/Git Bash)
sdk install maven
```

### Step 2: Build & Run
```powershell
cd spring-backend

# With globally installed Maven:
mvn spring-boot:run

# OR with Maven Wrapper (after downloading maven-wrapper.jar - see below):
./mvnw.cmd spring-boot:run

# With a custom MongoDB URI:
$env:MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/fleetflow"
mvn spring-boot:run
```

### Step 3: Download Maven Wrapper JAR (one-time setup)
```powershell
# From the spring-backend directory:
Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar" -OutFile ".mvn/wrapper/maven-wrapper.jar"
```

The server will start on **http://localhost:5000** – same port as the original Node.js backend.

## Frontend Integration

No changes needed to the frontend! All request URLs remain identical:
```
http://localhost:5000/api/...
```

The JWT token format and response shapes are 1:1 compatible with the original backend.
