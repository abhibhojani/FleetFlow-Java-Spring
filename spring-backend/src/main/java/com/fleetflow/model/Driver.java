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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drivers")
public class Driver {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotNull
    private Instant licenseExpiry;

    @NotNull
    @Min(0) @Max(100)
    private Integer safetyScore = 100;

    private String status = "Active"; // Active, On Leave, Suspended, On Trip

    private Boolean isOnDuty = false;

    private Instant suspendDate;

    private String imageUrl;

    private String assignedVehicleId;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
