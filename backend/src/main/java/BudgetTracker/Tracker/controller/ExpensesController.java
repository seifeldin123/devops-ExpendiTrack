package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.exceptions.*;
import BudgetTracker.Tracker.service.ExpensesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpensesController {
    @Autowired
    ExpensesService expenseService;
    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody Expenses expense) {
        try {
            Expenses createdExpense = expenseService.createExpense(expense);
            return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
        } catch (DuplicateExpenseNameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (InvalidInputException | InvalidDAteException | BudgetNotFoundException e) {
            // Handling for invalid input exception
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }
    }
    @GetMapping
    public List<Expenses> getAllExpenses() {

        return expenseService.getAllExpenses();
    }
    @GetMapping("/{id}")
    public Expenses getExpenseById(@PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }

    @PutMapping("/{id}")
    public Expenses updateExpense(@PathVariable Long id, @RequestBody Expenses expenseDetails) {
        return expenseService.updateExpense(id, expenseDetails);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Expenses> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public List<Expenses> getExpensesByUserId(@PathVariable Long userId) {
        return expenseService.getExpensesByUserId(userId);
    }

}
