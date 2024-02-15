package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("SELECT COUNT(b) > 0 FROM Budget b WHERE b.budgetDescription = :description AND b.user.id = :userId AND b.budgetId <> :excludedId")
    boolean existsByBudgetDescriptionAndUserIdExcludingId(@Param("description") String description, @Param("userId") Long userId, @Param("excludedId") Long excludedId);

}
