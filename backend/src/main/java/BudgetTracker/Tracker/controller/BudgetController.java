package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
import BudgetTracker.Tracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {
    @Autowired
    private  BudgetService budgetService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUserId(@PathVariable Long userId) {
        List<Budget> budgets = budgetService.getBudgetsByUserId(userId);
        return new ResponseEntity<>(budgets, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            Budget createdBudget = budgetService.createBudget(budget);
            return new ResponseEntity<>(createdBudget, HttpStatus.CREATED);
        } catch (DuplicateBudgetNameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
