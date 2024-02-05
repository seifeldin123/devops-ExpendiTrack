package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.service.ExpensesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class ExpensesController {
    @Autowired
    ExpensesService expenseService;
    @PostMapping
    public Expenses createExpense(@RequestBody Expenses expense) {
        return expenseService.createExpense(expense);
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
}
