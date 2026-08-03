package com.fleetflow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "maintenancelogs")
public class MaintenanceLog {

    @Id
    private String id;

    @NotBlank
    private String vehicleId;

    @NotBlank
    private String type;

    @NotBlank
    private String description;

    @NotBlank
    private String date;

    private Double cost;

    private String status = "Scheduled"; // Scheduled, In Progress, Completed

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
