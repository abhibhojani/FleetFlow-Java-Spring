package com.fleetflow.repository;

import com.fleetflow.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findAllByOrderByCreatedAtDesc();
    boolean existsByLicensePlate(String licensePlate);
}
