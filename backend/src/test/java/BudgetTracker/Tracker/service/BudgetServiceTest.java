package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
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

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private BudgetService budgetService;

    private User user;
    private Budget budget1;
    private Budget budget2;

    @BeforeEach
    void init() {
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
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Get budgets by user ID")
    void testGetBudgetsByUserId() {
        Long userId = 1L;
        List<Budget> userBudgets = Arrays.asList(budget1, budget2);
        when(budgetRepository.findByUserId(userId)).thenReturn(userBudgets);

        List<Budget> result = budgetService.getBudgetsByUserId(userId);

        assertEquals(2, result.size());
        assertEquals(userBudgets, result);
    }

    @Test
    @DisplayName("Create a budget successfully")
    void createBudget_Success() {
        // Mocking userService.existsById method
        when(userService.existsById(anyLong())).thenReturn(true);
        when(budgetRepository.existsByBudgetDescriptionAndUserId(budget1.getBudgetDescription(), user.getId())).thenReturn(false);
        when(budgetRepository.save(any(Budget.class))).thenReturn(budget1);

        Budget savedBudget = budgetService.createBudget(budget1);

        assertNotNull(savedBudget);
        assertEquals(budget1.getBudgetDescription(), savedBudget.getBudgetDescription());
        verify(budgetRepository).save(budget1);
    }

    @Test
    @DisplayName("Fail to create a budget due to duplicate name")
    void createBudget_ThrowsDuplicateBudgetNameException() {
        // Mocking userService.existsById method
        when(userService.existsById(anyLong())).thenReturn(true);

        // Mocking the behavior of existsByBudgetDescriptionAndUserId method
        when(budgetRepository.existsByBudgetDescriptionAndUserId(budget1.getBudgetDescription(), user.getId())).thenReturn(true);

        // Asserting that calling createBudget method throws DuplicateBudgetNameException
        assertThatThrownBy(() -> budgetService.createBudget(budget1))
                .isInstanceOf(DuplicateBudgetNameException.class)
                .hasMessageContaining("already exists");

        // Verify that the save method of budgetRepository was never called
        verify(budgetRepository, never()).save(any(Budget.class));
    }
}
