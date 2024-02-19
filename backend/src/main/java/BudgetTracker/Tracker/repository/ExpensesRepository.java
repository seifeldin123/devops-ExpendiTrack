package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * Repository interface for managing expenses.
 */
@Repository
public interface ExpensesRepository extends JpaRepository<Expenses,Long> {

    List<Expenses> findByBudget_User_Id(Long userId); // Custom query method

    boolean existsByExpensesDescriptionAndBudget_User_Id(String description, Long userId);

}
