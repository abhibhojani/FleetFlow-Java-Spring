package com.fleetflow.repository;

import com.fleetflow.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, String> {
    List<Driver> findAllByOrderByCreatedAtDesc();
}
