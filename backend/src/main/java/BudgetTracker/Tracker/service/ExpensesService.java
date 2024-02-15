package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.exceptions.BudgetNotFoundException;
import BudgetTracker.Tracker.exceptions.DuplicateExpenseNameException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.repository.BudgetRepository;
import BudgetTracker.Tracker.repository.ExpensesRepository;
import BudgetTracker.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
/**
 * Service class for handling business logic related to expenses.
 */
@Service
public class ExpensesService {
    @Autowired
    private ExpensesRepository expenseRepository;
    @Autowired
    private BudgetRepository budgetRepository;
    @Autowired
    private UserRepository userRepository;
    /**
     * Retrieves all expenses.
     *
     * @return List of all expenses.
     */
    public List<Expenses> getAllExpenses() {
        return expenseRepository.findAll();
    }
    /**
     * Retrieves an expense by its ID.
     *
     * @param id The ID of the expense to retrieve.
     * @return The expense with the specified ID, or null if not found.
     */
    public Expenses getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves expenses associated with a specific user.
     *
     * @param userId The ID of the user whose expenses to retrieve.
     * @return List of expenses associated with the specified user.
     */
    public List<Expenses> getExpensesByUserId(Long userId) {
        return expenseRepository.findByBudget_User_Id(userId);
    }

    /**
     * Creates a new expense.
     *
     * @param expense The expense object to be created.
     * @return The created expense.
     * @throws InvalidInputException          If the budget is not set in the expense, expenses description is not alphanumeric,
     *                                        expenses amount is negative, or expenses amount is greater than budget amount.
     * @throws BudgetNotFoundException       If the budget associated with the expense is not found.
     * @throws DuplicateExpenseNameException If an expense with the same name already exists for the user.
     */
    public Expenses createExpense(Expenses expense) {
        // Check if the budget is set
        if (expense.getBudget() == null || expense.getBudget().getBudgetId() == null) {
            throw new InvalidInputException("Budget is not set in the expense");
        }
        // Validate expenses description to be alphanumeric
        if (!isAlphanumeric(expense.getExpensesDescription())) {
            throw new InvalidInputException("ExpensesDescription must be alphanumeric");
        }
        // Validate expenses amount to be non-negative numbers
        if (expense.getExpensesAmount() < 0) {
            throw new InvalidInputException("expenses amount cannot be negative.");
        }
        // Check if the budget exists
        Budget budget = budgetRepository.findById(expense.getBudget().getBudgetId())
                .orElseThrow(() -> new BudgetNotFoundException("Budget with ID " + expense.getBudget().getBudgetId() + " not found"));

        // Check if the expense with the same description already exists for this budget
        boolean exists = expenseRepository.existsByExpensesDescriptionAndBudget_User_Id(expense.getExpensesDescription(), expense.getBudget().getBudgetId());
        if (exists) {
            throw new DuplicateExpenseNameException("An expense with the name \"" + expense.getExpensesDescription() + "\" already exists for this user.");
        }

        return expenseRepository.save(expense);
    }
    /**
     * Checks if a string contains only alphanumeric characters.
     *
     * @param str The string to be checked.
     * @return True if the string contains only alphanumeric characters or spaces, false otherwise.
     */
    private boolean isAlphanumeric(String str) {
        return str.matches("^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$");
    }
    /**
     * Updates an existing expense.
     *
     * @param id             The ID of the expense to update.
     * @param expenseDetails The updated expense details.
     * @return The updated expense.
     */
    public Expenses updateExpense(Long id, Expenses expenseDetails) {
        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setExpensesDescription(expenseDetails.getExpensesDescription());
                    expense.setExpensesAmount(expenseDetails.getExpensesAmount());
                    // other fields
                    return expenseRepository.save(expense);
                }).orElseGet(() -> {
                    expenseDetails.setExpensesId(id);
                    return expenseRepository.save(expenseDetails);
                });
    }
    /**
     * Deletes an expense by its ID.
     *
     * @param id The ID of the expense to delete.
     */
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}










