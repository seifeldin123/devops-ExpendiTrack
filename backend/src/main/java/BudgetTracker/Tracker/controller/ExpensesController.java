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
/**
 * Controller class for handling HTTP requests related to expenses.
 * Provides endpoints for creating, retrieving, updating, and deleting expenses,
 * as well as retrieving expenses by user ID.
 */
@RestController
@RequestMapping("/expenses")
public class ExpensesController {
    /**
     * Service class for handling business logic related to expenses.
     */
    @Autowired
    ExpensesService expenseService;
    /**
     * Endpoint for creating a new expense.
     *
     * @param expense The expense object to be created. Must be provided in the request body.
     * @return ResponseEntity containing the created expense if successful, or an error message with a
     * bad request status if the expense name is duplicate or if input is invalid.
     */
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
    /**
     * Endpoint for retrieving all expenses.
     *
     * @return List of all expenses.
     */
    @GetMapping
    public List<Expenses> getAllExpenses() {

        return expenseService.getAllExpenses();
    }
    /**
     * Endpoint for retrieving an expense by its ID.
     *
     * @param id The ID of the expense to retrieve.
     * @return The expense corresponding to the provided ID.
     */
    @GetMapping("/{id}")
    public Expenses getExpenseById(@PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }
    /**
     * Endpoint for updating an existing expense.
     *
     * @param id             The ID of the expense to update.
     * @param expenseDetails The updated expense details. Must be provided in the request body.
     * @return The updated expense.
     */
    @PutMapping("/{id}")
    public Expenses updateExpense(@PathVariable Long id, @RequestBody Expenses expenseDetails) {
        return expenseService.updateExpense(id, expenseDetails);
    }
    /**
     * Endpoint for deleting an expense by its ID.
     *
     * @param id The ID of the expense to delete.
     * @return ResponseEntity with a status of OK if the deletion was successful.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Expenses> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }
    /**
     * Endpoint for retrieving expenses by user ID.
     *
     * @param userId The ID of the user whose expenses to retrieve.
     * @return List of expenses belonging to the specified user.
     */
    @GetMapping("/user/{userId}")
    public List<Expenses> getExpensesByUserId(@PathVariable Long userId) {
        return expenseService.getExpensesByUserId(userId);
    }

}
