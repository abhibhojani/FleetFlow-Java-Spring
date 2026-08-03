package com.fleetflow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    @Indexed(unique = true)
    private String email;

    @NotBlank
    private String password;

    private String role = "manager"; // admin, driver, manager, dispatcher

    @CreatedDate
    private Instant createdAt;
}
