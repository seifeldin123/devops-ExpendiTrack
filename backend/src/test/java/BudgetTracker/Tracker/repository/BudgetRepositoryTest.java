package BudgetTracker.Tracker.repository;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=password",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class BudgetRepositoryTest {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpensesRepository expensesRepository;

    private Budget budget;

    private User user;

    private Expenses expenses;

    @BeforeEach
    public void init() {
        // Create users
        user = new User();
        user.setName("Seif");
        user.setEmail("Seif@hotmail.com");
        user = userRepository.save(user);

        // Create expenses
        expenses = new Expenses();
        expenses.setExpensesDescription("Books");
        expenses.setExpensesAmount(200);
        expenses.setExpensesDate(Instant.now());
//        expenses.setUser(user);

        // Create budgets
        budget = new Budget();
        budget.setBudgetDescription("College");
        budget.setBudgetAmount(1000);
        budget.setUser(user);
//        budget.setExpenses(Set.of(expenses));
    }
    @AfterEach
    void tearDown() {
        // Delete all user records from the repository after each test
        userRepository.deleteAll();
    }
    @Test
    @DisplayName("Should save the budget to the database")
    public void testSave() {
        // Save the budget to the database and get the saved budget
        Budget newBudget = budgetRepository.save(budget);
        // Verify that the saved budget is not null
        assertNotNull(newBudget);
        // Verify that the ID of the saved budget is generated and not null
        assertNotNull(newBudget.getBudgetId());
    }


    @Test
    @DisplayName("Should return a list of budgets for a given user id")
    void testFindByUserId() {
        // Save a budget for a specific user to the database
        Budget savedBudget = budgetRepository.save(budget);

        // Call the findByUserId method with the user's id
        List<Budget> budgetsForUser = budgetRepository.findByUserId(user.getId());

        // Verify that the returned list is not null
        assertNotNull(budgetsForUser);

        // Verify that the list contains the saved budget
        assertTrue(budgetsForUser.contains(savedBudget));
    }


    @Test
    @DisplayName("Check budget exists by description and user ID")
    void testExistsByBudgetDescriptionAndUserId() {
        // Given
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@user.com");
        User savedUser = userRepository.save(user);

        Budget budget = new Budget();
        budget.setBudgetDescription("Test Budget");
        budget.setBudgetAmount(500);
        budget.setUser(savedUser);
        budgetRepository.save(budget);

        // When
        boolean exists = budgetRepository.existsByBudgetDescriptionAndUserId("Test Budget", savedUser.getId());

        // Then
        assertTrue(exists, "Budget should exist for given description and user ID");

        // Test for a non-existent budget
        boolean notExists = budgetRepository.existsByBudgetDescriptionAndUserId("Nonexistent Budget", savedUser.getId());

        assertFalse(notExists, "Budget should not exist for given description and user ID");
    }

}