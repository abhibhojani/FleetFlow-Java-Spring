package com.fleetflow.repository;

import com.fleetflow.model.ExpenseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseLogRepository extends JpaRepository<ExpenseLog, String> {
    List<ExpenseLog> findAllByOrderByDateDesc();
}
