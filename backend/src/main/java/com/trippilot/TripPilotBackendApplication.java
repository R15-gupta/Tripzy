package com.trippilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TripPilotBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripPilotBackendApplication.class, args);
        System.out.println("\n-------------------------------------------------------------");
        System.out.println("🚀 TripPilot Spring Boot Backend is running at:");
        System.out.println("👉 API Base URL: http://localhost:8080/api");
        System.out.println("👉 H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("-------------------------------------------------------------\n");
    }
}
