package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.repository.BudgetRepository;
import BudgetTracker.Tracker.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BudgetService budgetService;

    private Budget budget1;
    private Budget budget2;
    private User user;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setName("Seif");
        user.setEmail("Seif@hotmail.com");



        budget1 = new Budget();
        budget1.setBudgetId(1L);
        budget1.setBudgetDescription("Vacation");
        budget1.setBudgetAmount(1000);
        budget1.setUser(user);

        budget2 = new Budget();
        budget2.setBudgetId(2L);
        budget2.setBudgetDescription("Groceries");
        budget2.setBudgetAmount(500);
        budget2.setUser(user);
    }
    @AfterEach
    void tearDown() {
        // Delete all user records from the repository after each test
        userRepository.deleteAll();
    }
    @Test
    @DisplayName("Get all budgets")
    public void testGetAllBudgets() {
        List<Budget> budgets = new ArrayList<>();
        budgets.add(budget1);
        budgets.add(budget2);
        when(budgetRepository.findAll()).thenReturn(budgets);

        List<Budget> result = budgetService.getAllBudgets();

        assertEquals(2, result.size());
        assertEquals(budgets, result);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Get budgets by user ID")
    public void testGetBudgetsByUserId() {
        Long userId = 1L;
        List<Budget> userBudgets = Arrays.asList(budget1, budget2);
        when(budgetRepository.findByUserId(userId)).thenReturn(userBudgets);

        List<Budget> result = budgetService.getBudgetsByUserId(userId);

        assertEquals(2, result.size());
        assertEquals(userBudgets, result);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Get a budget by ID")
    public void testGetBudgetById() {
        Long budgetId = 1L;
        when(budgetRepository.findById(budgetId)).thenReturn(Optional.of(budget1));

        Budget existingBudget = budgetService.getBudgetById(budgetId);

        assertNotNull(existingBudget);
        assertNotNull(existingBudget.getBudgetId());
        assertEquals(budgetId, existingBudget.getBudgetId());
    }

    @Test
    @DisplayName("Create a budget")
    public void testCreateBudget() {
        Budget newBudget = new Budget();
        newBudget.setBudgetDescription("Entertainment");
        newBudget.setBudgetAmount(200);
        newBudget.setUser(user);

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Stubbing the save method to return a budget with a non-null budgetId
        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> {
            Budget savedBudget = invocation.getArgument(0);
            savedBudget.setBudgetId(1L); // Set a sample budgetId or adjust as needed
            return savedBudget;
        });
        Budget result = budgetService.createBudget(newBudget);

        assertNotNull(result);
        assertNotNull(result.getBudgetId());
        assertEquals("Entertainment", result.getBudgetDescription());
        assertEquals(200, result.getBudgetAmount());
        assertEquals(user, result.getUser());
    }


    @Test
    @DisplayName("Update a budget")
    public void testUpdateBudget() {
        Long budgetId = 1L;
        Budget updatedBudget = new Budget();
        updatedBudget.setBudgetDescription("Updated Vacation");
        updatedBudget.setBudgetAmount(1200);
        updatedBudget.setUser(user);

        when(budgetRepository.findById(budgetId)).thenReturn(Optional.of(budget1));
        when(budgetRepository.save(any(Budget.class))).thenReturn(updatedBudget);

        Budget result = budgetService.updateBudget(budgetId, updatedBudget);

        assertNotNull(result);
        assertEquals("Updated Vacation", result.getBudgetDescription());
        assertEquals(1200, result.getBudgetAmount());
        assertEquals(user, result.getUser());
    }

    @Test
    @DisplayName("Delete a budget by ID")
    public void testDeleteBudgetById() {
        Long budgetId = 1L;

        budgetService.deleteBudget(budgetId);

        verify(budgetRepository, times(1)).deleteById(budgetId);
    }


}
