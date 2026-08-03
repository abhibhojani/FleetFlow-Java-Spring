package com.fleetflow.controller;

import com.fleetflow.model.MaintenanceLog;
import com.fleetflow.repository.MaintenanceLogRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceLogRepository maintenanceLogRepository;

    // GET /api/maintenance
    @GetMapping
    public ResponseEntity<List<MaintenanceLog>> getAllLogs() {
        return ResponseEntity.ok(maintenanceLogRepository.findAllByOrderByCreatedAtDesc());
    }

    // POST /api/maintenance
    @PostMapping
    public ResponseEntity<?> createLog(@Valid @RequestBody MaintenanceLog log) {
        try {
            MaintenanceLog saved = maintenanceLogRepository.save(log);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Server Error"));
        }
    }

    // PUT /api/maintenance/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLog(@PathVariable String id,
                                       @RequestBody MaintenanceLog updatedLog) {
        return maintenanceLogRepository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (updatedLog.getVehicleId() != null)    existing.setVehicleId(updatedLog.getVehicleId());
            if (updatedLog.getType() != null)         existing.setType(updatedLog.getType());
            if (updatedLog.getDescription() != null)  existing.setDescription(updatedLog.getDescription());
            if (updatedLog.getDate() != null)         existing.setDate(updatedLog.getDate());
            if (updatedLog.getCost() != null)         existing.setCost(updatedLog.getCost());
            if (updatedLog.getStatus() != null)       existing.setStatus(updatedLog.getStatus());
            return ResponseEntity.ok(maintenanceLogRepository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Log not found")));
    }
}
