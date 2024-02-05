package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
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

    public List<Budget> getBudgetsByUserId(Long userId) {

        return budgetRepository.findByUserId(userId);
    }

    public Budget createBudget(Budget budget) {
        boolean exists = budgetRepository.existsByBudgetDescriptionAndUserId(budget.getBudgetDescription(), budget.getUser().getId());
        if (exists) {
            throw new DuplicateBudgetNameException("A budget with the name \"" + budget.getBudgetDescription() + "\" already exists for this user.");
        }
        return budgetRepository.save(budget);
    }
}