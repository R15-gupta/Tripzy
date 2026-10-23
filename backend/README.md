# 🚀 TripPilot Spring Boot Backend Connection Guide

Iss folder me aapka complete **Spring Boot Backend** project create kar diya gaya hai.

---

## 📁 Directory Structure
```
d:/project/backend
├── pom.xml                                      (Maven dependencies: Spring Boot Web, Data JPA, H2)
├── README.md                                    (Instructions)
└── src
    └── main
        ├── java/com/trippilot
        │   ├── TripPilotBackendApplication.java  (Main Spring Boot Application)
        │   ├── config
        │   │   └── CorsConfig.java               (CORS configuration for frontend connection)
        │   ├── controller
        │   │   ├── AuthController.java           (Register & Login endpoints)
        │   │   └── BookingController.java        (Booking endpoints)
        │   ├── model
        │   │   ├── User.java                     (User Entity)
        │   │   └── Booking.java                  (Booking Entity)
        │   └── repository
        │       ├── UserRepository.java           (JPA Repository for Users)
        │       └── BookingRepository.java        (JPA Repository for Bookings)
        └── resources
            └── application.properties            (Server Port 8080 & H2 Database settings)
```

---

## ⚙️ How to Run Spring Boot Backend (Chalu Kaise Karein):

### Option 1: Command Prompt / Terminal se:
1. Open Terminal in `d:\project\backend` folder.
2. Run Maven command:
   ```bash
   mvnw spring-boot:run
   ```
   *ya agar Maven installed hai:*
   ```bash
   mvn spring-boot:run
   ```

### Option 2: Eclipse / IntelliJ IDEA se:
1. Open Eclipse or IntelliJ IDEA.
2. `Import` -> `Existing Maven Project` -> Select `d:\project\backend`.
3. Right click on `TripPilotBackendApplication.java` -> `Run As` -> `Java Application` / `Spring Boot App`.

---

## 🔗 Endpoints Summary:
- **Base URL:** `http://localhost:8080/api`
- **Register:** `POST http://localhost:8080/api/auth/register`
- **Login:** `POST http://localhost:8080/api/auth/login`
- **Bookings:** `POST http://localhost:8080/api/bookings`
- **View All Bookings:** `GET http://localhost:8080/api/bookings`
- **H2 Database Console:** `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:trippilotdb`
  - Username: `sa`
  - Password: *(blank)*

---

## 💡 Front-end Integration Note:
Aapka `AI.js` pehle Spring Boot Backend (`http://localhost:8080/api`) se connect hone ki koshish karega. Agar backend active nahi hai, to wo automatically local fallback par smoothly execute karega without breaking anything!
