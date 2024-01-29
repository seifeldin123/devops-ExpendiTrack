package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpensesRepository extends JpaRepository<Expenses,Long> {
}
