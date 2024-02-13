package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.exceptions.UserNotFoundException;
import BudgetTracker.Tracker.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * Controller class responsible for handling HTTP requests related to budgets.
 */
@RestController
@RequestMapping("/budgets")
public class BudgetController {
    @Autowired
    private  BudgetService budgetService;
    /**
     * Retrieves budgets associated with a specific user.
     *
     * @param userId The ID of the user whose budgets are to be retrieved.
     * @return ResponseEntity containing a list of budgets associated with the user, if found, along with the HTTP status.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUserId(@PathVariable Long userId) {
        List<Budget> budgets = budgetService.getBudgetsByUserId(userId);
        return new ResponseEntity<>(budgets, HttpStatus.OK);
    }
    /**
     * Creates a new budget.
     *
     * @param budget The budget object to be created.
     * @return ResponseEntity containing the created budget along with the HTTP status.
     *         If the budget creation fails due to duplicate name, invalid input, or user not found, an appropriate error message is returned.
     */
    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            Budget createdBudget = budgetService.createBudget(budget);
            return new ResponseEntity<>(createdBudget, HttpStatus.CREATED);
        } catch (DuplicateBudgetNameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (InvalidInputException e) {
            // Handling for invalid input exception
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        } catch (UserNotFoundException e) {
            // Handling for invalid input exception
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }

    }


}
