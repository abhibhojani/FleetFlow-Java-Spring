package com.fleetflow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String model;

    @NotBlank
    @Indexed(unique = true)
    private String licensePlate;

    private Double maxLoadCapacity;

    private Double odometer = 0.0;

    private String status = "Available"; // Available, On Trip, In Shop, Out of Service

    private String type = "Truck"; // Truck, Van, Car, Bike

    private String region = "North";

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
