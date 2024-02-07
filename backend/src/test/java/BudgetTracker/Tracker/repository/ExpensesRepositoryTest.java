package BudgetTracker.Tracker.repository;

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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa", "spring.datasource.password=password",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class ExpensesRepositoryTest {

    @Autowired
    private ExpensesRepository expensesRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;

    private Expenses expenses;

    @BeforeEach
    public void init() {
        // Create a user
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
    }

    @AfterEach
    void tearDown() {
        // Delete all user records from the repository after each test
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should save expenses to the database")
    public void testSave() {
        // Save the expenses to the database and get the saved expenses
        Expenses savedExpenses = expensesRepository.save(expenses);
        // Verify that the saved expenses is not null
        assertNotNull(savedExpenses);
        // Verify that the ID of the saved expenses is generated and not null
        assertNotNull(savedExpenses.getExpensesId());
    }

    @Test
    @DisplayName("Should return all expenses from the database")
    public void testFindAll() {
        // Save expenses to the database
        expensesRepository.save(expenses);
        // Retrieve the list of expenses from the database
        List<Expenses> expensesList = expensesRepository.findAll();
        // Ensure that the list is not null
        assertNotNull(expensesList);
        // Assert that the list has a size of 1
        assertEquals(1, expensesList.size());
        // Assert that the retrieved expenses match the saved expenses
        Expenses retrievedExpenses = expensesList.get(0);
        assertEquals("Books", retrievedExpenses.getExpensesDescription());
        assertEquals(200, retrievedExpenses.getExpensesAmount());
//        assertEquals(user.getId(), retrievedExpenses.getUser().getId());
    }

    @Test
    @DisplayName("Should return expenses by its id")
    public void testFindById() {
        // Save the expenses to the database
        Expenses savedExpenses = expensesRepository.save(expenses);
        // Retrieve the expenses by its ID
        Optional<Expenses> retrievedExpensesOptional = expensesRepository.findById(savedExpenses.getExpensesId());
        // Assert that the retrieved expenses is present and its properties match the saved expenses
        assertTrue(retrievedExpensesOptional.isPresent());
        Expenses retrievedExpenses = retrievedExpensesOptional.get();
        assertEquals(savedExpenses.getExpensesId(), retrievedExpenses.getExpensesId());
        assertEquals("Books", retrievedExpenses.getExpensesDescription());
        assertEquals(200, retrievedExpenses.getExpensesAmount());
//        assertEquals(user.getId(), retrievedExpenses.getUser().getId());
    }

    @Test
    @DisplayName("Should delete by id an existing expenses from the database")
    public void testDeleteById() {
        // Save the expenses to the database
        Expenses savedExpenses = expensesRepository.save(expenses);
        // Get the ID of the expenses
        Long id = savedExpenses.getExpensesId();
        // Delete the expenses from the database
        expensesRepository.deleteById(id);
        // Flush changes to the database
        expensesRepository.flush();
        // Verify that the expenses is no longer in the database
        Optional<Expenses> existingExpensesOptional = expensesRepository.findById(id);
        assertFalse(existingExpensesOptional.isPresent());
    }

}
