# Migrate Backend from MongoDB to PostgreSQL

This plan outlines the steps to transition the data persistence layer of the FleetFlow Spring Boot backend from MongoDB to PostgreSQL.

## Proposed Changes

We will swap out `spring-boot-starter-data-mongodb` for `spring-boot-starter-data-jpa` and the official PostgreSQL driver. All JSON documents will be mapped to relational tables.

---

### Dependencies

#### [MODIFY] [pom.xml](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/pom.xml)
- Remove `spring-boot-starter-data-mongodb`
- Add `spring-boot-starter-data-jpa`
- Add `postgresql` (PostgreSQL JDBC Driver)

---

### Configuration

#### [DELETE] [MongoConfig.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/config/MongoConfig.java)
- Remove MongoDB auditing configuration.

#### [NEW] [JpaConfig.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/config/JpaConfig.java)
- Re-instate `@EnableJpaAuditing` for `createdAt` and `updatedAt` timestamps.

#### [MODIFY] [application.properties](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/resources/application.properties)
- Remove `spring.data.mongodb.uri`
- Add PostgreSQL connection strings (URL, username, password).
- Set `spring.jpa.hibernate.ddl-auto=update` to auto-generate the database schema based on the models.

---

### Data Models
All models will be refactored to use Jakarta Persistence (JPA) annotations instead of Spring Data MongoDB annotations. By utilizing `GenerationType.UUID` on a String, Hibernate 6 will automatically generate and map UUIDs to the string fields, ensuring identical API JSON responses!

#### [MODIFY] [User.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/model/User.java)
- Change `@Document` to `@Entity` and `@Table(name = "users")`
- Change `@Id` to `jakarta.persistence.Id` with `@GeneratedValue(strategy = GenerationType.UUID)`
- Change `@Indexed(unique = true)` to `@Column(unique = true)` on email.

#### [MODIFY] [Driver.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/model/Driver.java)
- Change to `@Entity` and `@Table(name = "drivers")`

#### [MODIFY] [Vehicle.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/model/Vehicle.java)
- Change to `@Entity` and `@Table(name = "vehicles")`

#### [MODIFY] [MaintenanceLog.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/model/MaintenanceLog.java)
- Change to `@Entity` and `@Table(name = "maintenance_logs")`

#### [MODIFY] [ExpenseLog.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/model/ExpenseLog.java)
- Change to `@Entity` and `@Table(name = "expense_logs")`

---

### Repositories

#### [MODIFY] [UserRepository.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/repository/UserRepository.java)
#### [MODIFY] [DriverRepository.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/repository/DriverRepository.java)
#### [MODIFY] [VehicleRepository.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/repository/VehicleRepository.java)
#### [MODIFY] [MaintenanceLogRepository.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/repository/MaintenanceLogRepository.java)
#### [MODIFY] [ExpenseLogRepository.java](file:///d:/abhibhojani-FleetFlow-05a9e35/abhibhojani-FleetFlow-05a9e35/spring-backend/src/main/java/com/fleetflow/repository/ExpenseLogRepository.java)
- Update inheritance from `MongoRepository<T, String>` to `JpaRepository<T, String>`.

## Open Questions

> [!IMPORTANT]
> **PostgreSQL Configuration:** Do you have PostgreSQL currently running locally on your machine on port 5432? What is the `username` and `password` that I should safely place in the `application.properties` configuration to connect to it?

## Verification Plan
1. Start the Spring Boot Application with `mvn spring-boot:run`.
2. Ensure it connects to Postgres and auto-generates the schemas without errors.
3. Test registering a user on the frontend (this fires an event down to the new Postgres db).
