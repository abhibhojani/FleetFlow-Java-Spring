package com.fleetflow.repository;

import com.fleetflow.model.ExpenseLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExpenseLogRepository extends MongoRepository<ExpenseLog, String> {
    List<ExpenseLog> findAllByOrderByDateDesc();
}
