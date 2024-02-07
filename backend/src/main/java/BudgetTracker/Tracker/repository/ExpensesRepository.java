package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpensesRepository extends JpaRepository<Expenses,Long> {
    List<Expenses> findByBudget_User_Id(Long userId); // Custom query method

}
