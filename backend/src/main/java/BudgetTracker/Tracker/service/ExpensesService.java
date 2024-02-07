package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
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

//    public Expenses createExpense(Expenses expense) {
//        // Ensure that the ID is null to trigger database-generated ID
//        expense.setExpensesId(null);
//        return expenseRepository.save(expense);
//    }

    public List<Expenses> getExpensesByUserId(Long userId) {
        return expenseRepository.findByBudget_User_Id(userId);
    }


    public Expenses createExpense(Expenses expense) {
        if (expense.getBudget() != null && expense.getBudget().getBudgetId() != null) {
            Long budgetId = expense.getBudget().getBudgetId();
            Budget budget = budgetRepository.findById(budgetId).orElse(null);
            if (budget != null) {
                expense.setBudget(budget);
            } else {
                // Budget not found, handle accordingly
                throw new RuntimeException("Budget not found for ID: " + budgetId);
            }
        } else {
            // Budget is not set, handle accordingly
            throw new RuntimeException("Budget is not set in the expense");
        }
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










