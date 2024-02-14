package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
/**
 * Repository interface for managing users.
 */
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByNameAndEmail(String name, String email);
}
