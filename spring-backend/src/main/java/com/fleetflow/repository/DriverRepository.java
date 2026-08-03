package com.fleetflow.repository;

import com.fleetflow.model.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DriverRepository extends MongoRepository<Driver, String> {
    List<Driver> findAllByOrderByCreatedAtDesc();
}
