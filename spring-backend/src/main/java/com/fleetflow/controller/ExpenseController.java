package com.fleetflow.controller;

import com.fleetflow.model.ExpenseLog;
import com.fleetflow.repository.ExpenseLogRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseLogRepository expenseLogRepository;

    // GET /api/expenses
    @GetMapping
    public ResponseEntity<List<ExpenseLog>> getAllExpenses() {
        return ResponseEntity.ok(expenseLogRepository.findAllByOrderByDateDesc());
    }

    // POST /api/expenses
    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody ExpenseLog log) {
        try {
            ExpenseLog saved = expenseLogRepository.save(log);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Server Error"));
        }
    }

    // PUT /api/expenses/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable String id,
                                           @RequestBody ExpenseLog updatedLog) {
        return expenseLogRepository.findById(id).<ResponseEntity<?>>map(existing -> {
            if (updatedLog.getVehicleId() != null)  existing.setVehicleId(updatedLog.getVehicleId());
            if (updatedLog.getDate() != null)        existing.setDate(updatedLog.getDate());
            if (updatedLog.getType() != null)        existing.setType(updatedLog.getType());
            if (updatedLog.getAmount() != null)      existing.setAmount(updatedLog.getAmount());
            if (updatedLog.getLiters() != null)      existing.setLiters(updatedLog.getLiters());
            return ResponseEntity.ok(expenseLogRepository.save(existing));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Log not found")));
    }

    // DELETE /api/expenses/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable String id) {
        return expenseLogRepository.findById(id).map(log -> {
            expenseLogRepository.delete(log);
            return ResponseEntity.ok((Object) Map.of("message", "Expense log removed"));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Log not found")));
    }
}
