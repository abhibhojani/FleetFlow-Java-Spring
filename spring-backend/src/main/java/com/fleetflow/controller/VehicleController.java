package com.fleetflow.controller;

import com.fleetflow.model.Vehicle;
import com.fleetflow.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    // GET /api/vehicles
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAllByOrderByCreatedAtDesc());
    }

    // POST /api/vehicles
    @PostMapping
    public ResponseEntity<?> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        try {
            Vehicle saved = vehicleRepository.save(vehicle);
            return ResponseEntity.status(201).body(saved);
        } catch (DuplicateKeyException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "License Plate already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Server Error"));
        }
    }

    // PUT /api/vehicles/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable String id,
                                           @RequestBody Vehicle updatedVehicle) {
        return vehicleRepository.findById(id).map(existing -> {
            if (updatedVehicle.getName() != null)           existing.setName(updatedVehicle.getName());
            if (updatedVehicle.getModel() != null)          existing.setModel(updatedVehicle.getModel());
            if (updatedVehicle.getLicensePlate() != null)   existing.setLicensePlate(updatedVehicle.getLicensePlate());
            if (updatedVehicle.getMaxLoadCapacity() != null) existing.setMaxLoadCapacity(updatedVehicle.getMaxLoadCapacity());
            if (updatedVehicle.getOdometer() != null)       existing.setOdometer(updatedVehicle.getOdometer());
            if (updatedVehicle.getStatus() != null)         existing.setStatus(updatedVehicle.getStatus());
            if (updatedVehicle.getType() != null)           existing.setType(updatedVehicle.getType());
            if (updatedVehicle.getRegion() != null)         existing.setRegion(updatedVehicle.getRegion());
            return ResponseEntity.ok(vehicleRepository.save(existing));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Vehicle not found")));
    }

    // DELETE /api/vehicles/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable String id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicleRepository.delete(vehicle);
            return ResponseEntity.ok((Object) Map.of("message", "Vehicle removed successfully"));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Vehicle not found")));
    }
}
