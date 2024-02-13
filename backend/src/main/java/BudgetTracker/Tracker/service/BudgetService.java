package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.exceptions.UserNotFoundException;
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

    @Autowired
    private UserService userService;

    public List<Budget> getBudgetsByUserId(Long userId) {

        return budgetRepository.findByUserId(userId);
    }

    public Budget createBudget(Budget budget) {

        // Check if the user exists in the database
        boolean userExists = userService.existsById(budget.getUser().getId());
        if (!userExists) {
            throw new UserNotFoundException("User with ID " + budget.getUser().getId() + " not found.");
        }
        boolean exists = budgetRepository.existsByBudgetDescriptionAndUserId(budget.getBudgetDescription(), budget.getUser().getId());
        if (exists) {
            throw new DuplicateBudgetNameException("A budget with the name \"" + budget.getBudgetDescription() + "\" already exists for this user.");
        }
        // Validate alphanumeric name
        if (!isValidAlphanumeric(budget.getBudgetDescription())) {
            throw new InvalidInputException("BudgetDescription must be alphanumeric");
        }

        // Check if budget amount is negative
        if (budget.getBudgetAmount() < 0) {
            throw new InvalidInputException("Budget amount cannot be negative.");
        }

        return budgetRepository.save(budget);
    }
    private boolean isValidAlphanumeric(String name) {
        return name.matches("^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$");
    }
}