package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.service.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class BudgetControllerTest {

    @Mock
    private BudgetService budgetService;

    @InjectMocks
    private BudgetController budgetController;

    // Initialize mocks before each test\

    private User user;
    private Budget budget1;
    private Budget budget2;

    // Initialize mocks and objects before each test
    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        // Initialize user
        user = new User();
        user.setId(1L);
        user.setName("Seif");
        user.setEmail("Seif@hotmail.com");

        // Initialize budgets
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

    @Test
    void getBudgetsByUserId() {
        Long userId = 1L;
        List<Budget> expectedBudgets = new ArrayList<>();
        when(budgetService.getBudgetsByUserId(userId)).thenReturn(expectedBudgets);

        ResponseEntity<List<Budget>> responseEntity = budgetController.getBudgetsByUserId(userId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedBudgets, responseEntity.getBody());
        verify(budgetService).getBudgetsByUserId(userId);
    }

    @Test
    void getAllBudgets() {
        List<Budget> expectedBudgets = new ArrayList<>();
        when(budgetService.getAllBudgets()).thenReturn(expectedBudgets);

        ResponseEntity<List<Budget>> responseEntity = budgetController.getAllBudgets();

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedBudgets, responseEntity.getBody());
        verify(budgetService).getAllBudgets();
    }

    @Test
    void getBudgetById() {
        Long id = 1L;
        Budget expectedBudget = new Budget();
        when(budgetService.getBudgetById(id)).thenReturn(expectedBudget);

        Budget result = budgetController.getBudgetById(id);

        assertEquals(expectedBudget, result);
        verify(budgetService).getBudgetById(id);
    }

    @Test
    void createBudget() {
        Budget inputBudget = new Budget();
        Budget expectedBudget = new Budget();
        when(budgetService.createBudget(inputBudget)).thenReturn(expectedBudget);

        Budget result = budgetController.createBudget(inputBudget);

        assertEquals(expectedBudget, result);
        verify(budgetService).createBudget(inputBudget);
    }

    @Test
    void updateBudget() {
        Long id = 1L;
        Budget budgetDetails = new Budget();
        Budget expectedBudget = new Budget();
        when(budgetService.updateBudget(id, budgetDetails)).thenReturn(expectedBudget);

        Budget result = budgetController.updateBudget(id, budgetDetails);

        assertEquals(expectedBudget, result);
        verify(budgetService).updateBudget(id, budgetDetails);
    }

    @Test
    void deleteBudget() {
        Long id = 1L;
        ResponseEntity<?> result = budgetController.deleteBudget(id);

        assertEquals(ResponseEntity.ok().build(), result);
        verify(budgetService).deleteBudget(id);
    }
}