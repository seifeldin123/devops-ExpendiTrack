package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.service.ExpensesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpensesController {
    @Autowired
    ExpensesService expenseService;
    @PostMapping
    @Operation(summary = "Create new expense", responses = {
            @ApiResponse(description = "expense successfully created", responseCode = "201",
            content = @Content(schema = @Schema(implementation = Expenses.class))),
            @ApiResponse(description = "Bad request", responseCode = "400")
    })
    public Expenses createExpense(@RequestBody Expenses expense) {
        return expenseService.createExpense(expense);
    }
    @GetMapping
    @Operation(summary = "Get All expenses", responses = {
            @ApiResponse(description = "Expenses found", responseCode = "200"),
            @ApiResponse(description = "Expenses not found", responseCode = "200")
    })
    public List<Expenses> getAllExpenses() {

        return expenseService.getAllExpenses();
    }
    @GetMapping("/{id}")
    @Operation(summary = "Get Expense By Id", responses = {
            @ApiResponse(description = "Expense found", responseCode = "200"),
            @ApiResponse(description = "Expense not found", responseCode = "200")
    })
    public Expenses getExpenseById(@PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense",
            description = "Updates an expense identified by its Id with new details provided in the request body.",
            parameters = {
                    @Parameter(name = "id", description = "Id of the expense to update", required = true, example = "1")
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Expense object that needs to be updated in the database",
                    required = true, content = @Content(
                            schema = @Schema(implementation = Expenses.class))),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Expense updated successfully", content = @Content(schema = @Schema(implementation = Expenses.class))),
                    @ApiResponse(responseCode = "404", description = "Expense not found"),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            })
    public Expenses updateExpense(@PathVariable Long id, @RequestBody Expenses expenseDetails) {
        return expenseService.updateExpense(id, expenseDetails);
    }
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense",
            description = "Deletes an expense identified by its id.",
            parameters = {
                    @Parameter(name = "id", description = "Id of the expense to delete", required = true, example = "1")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Expense deleted successfully"),
                    @ApiResponse(responseCode = "404", description = "Expense not found")
            })
    public ResponseEntity<Expenses> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get Expenses By User", responses = {
            @ApiResponse(description = "Expenses found", responseCode = "200"),
            @ApiResponse(description = "Expenses not found", responseCode = "200")
    })
    public List<Expenses> getExpensesByUserId(@PathVariable Long userId) {
        return expenseService.getExpensesByUserId(userId);
    }

}
