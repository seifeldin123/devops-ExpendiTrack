package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Expenses;
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

    public Expenses createExpense(Expenses expense) {
        // Ensure that the ID is null to trigger database-generated ID
        expense.setExpensesId(null);
        return expenseRepository.save(expense);
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

