package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByNameAndEmail(String name, String email);
}
