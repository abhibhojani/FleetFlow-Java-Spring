package com.fleetflow.repository;

import com.fleetflow.model.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, String> {
    List<MaintenanceLog> findAllByOrderByCreatedAtDesc();
}
