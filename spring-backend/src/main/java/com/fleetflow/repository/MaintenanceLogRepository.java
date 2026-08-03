package com.fleetflow.repository;

import com.fleetflow.model.MaintenanceLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MaintenanceLogRepository extends MongoRepository<MaintenanceLog, String> {
    List<MaintenanceLog> findAllByOrderByCreatedAtDesc();
}
