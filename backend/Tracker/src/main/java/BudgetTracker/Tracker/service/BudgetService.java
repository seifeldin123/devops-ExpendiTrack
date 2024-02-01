package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.repository.BudgetRepository;
import BudgetTracker.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {
    @Autowired
    private  BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;



    public List<Budget> getAllBudgets() {

        return budgetRepository.findAll();
    }


    public List<Budget> getBudgetsByUserId(Long userId) {

        return budgetRepository.findByUserId(userId);
    }


    public Budget getBudgetById(Long id) {

        return budgetRepository.findById(id).orElse(null);
    }

    public Budget createBudget(Budget budget) {
        if (budget.getUser() != null) {
            Long userId = budget.getUser().getId();
            User user = userRepository.findById(userId).orElse(null);
            budget.setUser(user);
        }
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, Budget budgetDetails) {
        return budgetRepository.findById(id)
                .map(budget -> {
                    budget.setBudgetDescription(budgetDetails.getBudgetDescription());
                    budget.setBudgetAmount(budgetDetails.getBudgetAmount());
                    // other fields
                    return budgetRepository.save(budget);
                }).orElseGet(() -> {
                    budgetDetails.setBudgetId(id);
                    return budgetRepository.save(budgetDetails);
                });
    }

    public void deleteBudget(Long id) {

        budgetRepository.deleteById(id);
    }
}