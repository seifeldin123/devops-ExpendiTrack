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
@Service
public class ExpensesService {
    @Autowired
    private ExpensesRepository expenseRepository;
    @Autowired
    private BudgetRepository budgetRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Expenses> getAllExpenses() {
        return expenseRepository.findAll();
    }
    public Expenses getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }


    public List<Expenses> getExpensesByUserId(Long userId) {
        return expenseRepository.findByBudget_User_Id(userId);
    }


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

        // Validate that the expenses amount is not greater than the budget amount
        if (expense.getExpensesAmount() > budget.getBudgetAmount()) {
            throw new InvalidInputException("Expenses amount cannot be greater than budget amount");
        }
        // Check if the expense with the same description already exists for this budget
        boolean exists = expenseRepository.existsByExpensesDescriptionAndBudget_User_Id(expense.getExpensesDescription(), expense.getBudget().getBudgetId());
        if (exists) {
            throw new DuplicateExpenseNameException("An expense with the name \"" + expense.getExpensesDescription() + "\" already exists for this user.");
        }

        return expenseRepository.save(expense);
    }

    private boolean isAlphanumeric(String str) {
        return str.matches("^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$");
    }



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

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}










