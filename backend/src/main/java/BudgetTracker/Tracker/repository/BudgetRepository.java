package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * Repository interface for managing budgets.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget,Long> {

    List<Budget> findByUserId(Long userId);

    // Method to check if a budget with the specified name exists for a given user ID
    boolean existsByBudgetDescriptionAndUserId(String budgetDescription, Long budgetId);
}
