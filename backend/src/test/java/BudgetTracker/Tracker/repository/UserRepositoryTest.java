package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");

        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        // Initialize budgets as a Set
        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
//        user.setBudgets(budgets);

        userRepository.save(user); // Save the user to the repository
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    void itShouldRetrieveUserById() {
        Long userId = user.getId();

        Optional<User> maybeUser = userRepository.findById(userId);

        assertThat(maybeUser).isPresent();
        assertThat(maybeUser.get()).isEqualTo(user);
    }


    @Test
    @DisplayName("Find user by name and email")
    void testFindByNameAndEmail() {
        Optional<User> foundUser = userRepository.findByNameAndEmail(user.getName(), user.getEmail());

        assertThat(foundUser.isPresent()).isTrue();
        foundUser.ifPresent(u -> {
            assertThat(u.getName()).isEqualTo(user.getName());
            assertThat(u.getEmail()).isEqualTo(user.getEmail());
        });
    }

    @Test
    @DisplayName("Save user successfully")
    void testSaveUser() {
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("newuser@example.com");
        User savedUser = userRepository.save(newUser);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
    }
}
