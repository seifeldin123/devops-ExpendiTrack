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
        expenses.setUser(user);

        // Create budgets
        budget = new Budget();
        budget.setBudgetDescription("College");
        budget.setBudgetAmount(1000);
        budget.setUser(user);
        budget.setExpenses(Set.of(expenses));
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
    @DisplayName("Should return the budget list with a size of 1")
    void testFindAll() {
        // Save the budget to the database
        budgetRepository.save(budget);
        // Retrieve the list of budget from the database
        Iterable<Budget> budgetList = budgetRepository.findAll();
        // Ensure that the list is not null
        assertNotNull(budgetList);
        // Assert that the list has a size of 1
        assertEquals(1, budgetList.spliterator().getExactSizeIfKnown());
    }

    @Test
    @DisplayName("Should return budget by its id")
    void testFindById() {
        // Save the budget to the database
        Budget savedBudget = budgetRepository.save(budget);
        // Retrieve the budget by its ID
        Optional<Budget> retrievedBudget1Optional = budgetRepository.findById(savedBudget.getBudgetId());
        // Assert that the retrieved budget is present and its properties match the saved budget
        assertTrue(retrievedBudget1Optional.isPresent());
        Budget retrievedBudget = retrievedBudget1Optional.get();
        assertEquals(savedBudget.getBudgetId(), retrievedBudget.getBudgetId());
        assertEquals("College", retrievedBudget.getBudgetDescription());
        assertEquals(1000, retrievedBudget.getBudgetAmount());

        // Retrieve users and expenses for the budget and assert their properties
        User retrievedUser = savedBudget.getUser();
        assertNotNull(retrievedUser);
        assertEquals(user.getId(), retrievedUser.getId());

        Expenses retrievedExpenses = expensesRepository.findById(expenses.getExpensesId()).orElse(null);
        assertNotNull(retrievedExpenses);
        assertEquals(expenses.getExpensesId(), retrievedExpenses.getExpensesId());
    }

    @Test
    @DisplayName("Should delete by id an existing budget from the database")
    void testDeleteById() {
        // Save the first budget to the database
        Budget savedBudget1 = budgetRepository.save(budget);
        // Get the ID of the budget
        Long id1 = savedBudget1.getBudgetId();
        // Delete the budget from the database
        budgetRepository.deleteById(id1);
        // Flush changes to the database
        budgetRepository.flush();
        // Verify that the  budget is no longer in the database
        Optional<Budget> existingBudget1Optional = budgetRepository.findById(id1);
        assertFalse(existingBudget1Optional.isPresent());

    }

    @Test
    @DisplayName("Should calculate remaining budget correctly")
    void testGetRemainingBudget() {
        // Save the budget to the database
        Budget savedBudget = budgetRepository.save(budget);

        // Add more expenses
        Expenses additionalExpenses = new Expenses();
        additionalExpenses.setExpensesDescription("Food");
        additionalExpenses.setExpensesAmount(300);
        additionalExpenses.setExpensesDate(Instant.now());
        additionalExpenses.setUser(user);
        additionalExpenses.setBudget(savedBudget);

        // Create a new set with the additional expense
        Set<Expenses> updatedExpenses = new HashSet<>(savedBudget.getExpenses());
        updatedExpenses.add(additionalExpenses);

        // Set the updated set to the expenses property
        savedBudget.setExpenses(updatedExpenses);

        budgetRepository.save(savedBudget);

        // Retrieve the budget by its ID
        Optional<Budget> retrievedBudgetOptional = budgetRepository.findById(savedBudget.getBudgetId());

        assertTrue(retrievedBudgetOptional.isPresent());
        Budget retrievedBudget = retrievedBudgetOptional.get();

        // Ensure the remaining budget is calculated correctly (1000 - 200 - 300 = 500)
        assertEquals(500, retrievedBudget.calculateRemainingBudget());
    }
}