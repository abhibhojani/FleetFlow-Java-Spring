package com.fleetflow.controller;

import com.fleetflow.model.Driver;
import com.fleetflow.repository.DriverRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    // GET /api/drivers
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAllByOrderByCreatedAtDesc());
    }

    // POST /api/drivers
    @PostMapping
    public ResponseEntity<?> createDriver(@Valid @RequestBody Driver driver) {
        try {
            Driver saved = driverRepository.save(driver);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Server Error"));
        }
    }

    // PUT /api/drivers/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable String id,
                                          @RequestBody Driver updatedDriver) {
        return driverRepository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (updatedDriver.getName() != null)         existing.setName(updatedDriver.getName());
            if (updatedDriver.getLicenseExpiry() != null) existing.setLicenseExpiry(updatedDriver.getLicenseExpiry());
            if (updatedDriver.getSafetyScore() != null)  existing.setSafetyScore(updatedDriver.getSafetyScore());
            if (updatedDriver.getStatus() != null)       existing.setStatus(updatedDriver.getStatus());
            if (updatedDriver.getIsOnDuty() != null)     existing.setIsOnDuty(updatedDriver.getIsOnDuty());
            if (updatedDriver.getSuspendDate() != null)  existing.setSuspendDate(updatedDriver.getSuspendDate());
            if (updatedDriver.getImageUrl() != null)     existing.setImageUrl(updatedDriver.getImageUrl());
            if (updatedDriver.getAssignedVehicleId() != null)
                existing.setAssignedVehicleId(updatedDriver.getAssignedVehicleId());
            return ResponseEntity.ok(driverRepository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Driver not found")));
    }

    // DELETE /api/drivers/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable String id) {
        return driverRepository.findById(id).<ResponseEntity<?>>map(driver -> {
            driverRepository.delete(driver);
            return ResponseEntity.ok((Object) Map.of("message", "Driver profile removed"));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Driver not found")));
    }
}
