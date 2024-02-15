package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.BudgetNotFoundException;
import BudgetTracker.Tracker.exceptions.InvalidDAteException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.service.ExpensesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExpensesController.class)
public class ExpensesControllerTest {

    @MockBean
    private ExpensesService expensesService;

    @Autowired
    private MockMvc mockMvc;
    @InjectMocks
    private ExpensesController expensesController;

    private User user;
    private Budget budget;
    private Expenses expense1;
    private Expenses expense2;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        // Initialize user
        user = new User();
        user.setId(1L);
        user.setName("Seif");
        user.setEmail("Seif@hotmail.com");

        // Initialize budget
        budget = new Budget();
        budget.setBudgetId(1L);
        budget.setBudgetDescription("Vacation");
        budget.setBudgetAmount(1000);
        budget.setUser(user);


        // Initialize expenses
        expense1 = new Expenses();
        expense1.setExpensesId(1L);
        expense1.setExpensesDescription("Groceries");
        expense1.setExpensesAmount(50);
        expense1.setExpensesDate(Instant.now());
        expense1.setBudget(budget);


        expense2 = new Expenses();
        expense2.setExpensesId(2L);
        expense2.setExpensesDescription("Utilities");
        expense2.setExpensesAmount(100);
        expense2.setExpensesDate(Instant.now());
        expense2.setBudget(budget);
    }

    @Test
    @DisplayName("Should create a new expense and return HTTP status 201 Created")
    void createExpenseTest() {
        // Mock the service method to return the created expense
        when(expensesService.createExpense(expense1)).thenReturn(expense1);

        // Call the controller method to create the expense
        ResponseEntity<?> responseEntity = expensesController.createExpense(expense1);

        // Verify that the response status is 201 Created
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());

        // Verify that the created expense is returned in the response body
        assertEquals(expense1, responseEntity.getBody());

        // Verify that the createExpense method of the service is called with the provided expense
        verify(expensesService).createExpense(expense1);
    }
    @Test
    @DisplayName("Should return all expenses from the database")
    void getAllExpensesTest() {
        List<Expenses> expectedExpenses = new ArrayList<>();
        expectedExpenses.add(expense1);
        expectedExpenses.add(expense2);

        when(expensesService.getAllExpenses()).thenReturn(expectedExpenses);

        List<Expenses> allExpenses = expensesController.getAllExpenses();

        assertEquals(expectedExpenses, allExpenses);
        verify(expensesService).getAllExpenses();
    }
    @Test
    @DisplayName("Should return expenses by its id")
    void getExpenseByIdTest() {
        Long expenseId = 1L;
        when(expensesService.getExpenseById(expenseId)).thenReturn(expense1);

        Expenses retrievedExpense = expensesController.getExpenseById(expenseId);

        assertEquals(expense1, retrievedExpense);
        verify(expensesService).getExpenseById(expenseId);
    }
    @Test
    @DisplayName("Should update an existing expense from the database")
    void updateExpenseByIdTest() {
        Long expenseId = 1L;
        Expenses updatedExpense = new Expenses();
        updatedExpense.setExpensesDescription("Updated Groceries");
        updatedExpense.setExpensesAmount(75);
        updatedExpense.setExpensesDate(Instant.now());
        updatedExpense.setBudget(budget);


        when(expensesService.updateExpense(expenseId, updatedExpense)).thenReturn(updatedExpense);

        Expenses result = expensesController.updateExpense(expenseId, updatedExpense);

        assertEquals(updatedExpense, result);
        verify(expensesService).updateExpense(expenseId, updatedExpense);
    }

    @Test
    @DisplayName("Should delete by id an existing expenses from the database")
    void deleteExpenseByIdTest() {
        Long expenseId = 1L;

        ResponseEntity<Expenses> result = expensesController.deleteExpense(expenseId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(expensesService).deleteExpense(expenseId);
    }

    @Test
    void createExpensesThrowsInvalidInputExceptions() throws Exception {
        given(expensesService.createExpense(any(Expenses.class))).willThrow(new InvalidInputException("Invalid input"));
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"expensesDescription\":\"Walmart\",\"expensesAmount\":\"-500\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid input")));
    }

    @Test
    void createExpensesThrowsInvalidDAteException() throws Exception {
        given(expensesService.createExpense(any(Expenses.class))).willThrow(new InvalidDAteException("Invalid Date input"));
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"expensesDescription\":\"Walmart\",\"expensesAmount\":\"-500\"," +
                                " \"expensesDate\": \"2020-01-01T00:00:00Z\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid Date input")));
    }

    @Test
    void createExpensesThrowsBudgetNotFoundException() throws Exception {
        given(expensesService.createExpense(any(Expenses.class)))
                .willThrow(new BudgetNotFoundException("Budget not found"));

        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"expensesDescription\":\"Walmart\",\"expensesAmount\":\"-500\"," +
                                " \"expensesDate\": \"2020-01-01T00:00:00Z\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid input: Budget not found")));
    }
    }







