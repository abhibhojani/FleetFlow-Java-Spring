package com.fleetflow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "expenselogs")
public class ExpenseLog {

    @Id
    private String id;

    @NotBlank
    private String vehicleId;

    private Instant date = Instant.now();

    @NotBlank
    private String type; // Fuel, Maintenance, Other

    @NotNull
    private Double amount;

    private Double liters; // Optional, only applicable if type is Fuel

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
