package com.fleetflow.repository;

import com.fleetflow.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    List<Vehicle> findAllByOrderByCreatedAtDesc();
    boolean existsByLicensePlate(String licensePlate);
}
