package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
