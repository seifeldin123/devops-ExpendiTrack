package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
import BudgetTracker.Tracker.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
    @Operation(summary = "Find budgets by user id", responses = {
            @ApiResponse(description = "budgets found", responseCode = "200"),
            @ApiResponse(description = "budgets not found", responseCode = "200")
    })
    public ResponseEntity<List<Budget>> getBudgetsByUserId(@PathVariable Long userId) {
        List<Budget> budgets = budgetService.getBudgetsByUserId(userId);
        return new ResponseEntity<>(budgets, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Create a new budget", responses = {
            @ApiResponse(description = "Budget Created successfully", responseCode = "201",
                    content = @Content(schema = @Schema(implementation = Budget.class))),
            @ApiResponse(description = "Bad Request", responseCode = "400")
    })
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            Budget createdBudget = budgetService.createBudget(budget);
            return new ResponseEntity<>(createdBudget, HttpStatus.CREATED);
        } catch (DuplicateBudgetNameException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
