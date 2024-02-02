package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.Expenses;
import BudgetTracker.Tracker.repository.ExpensesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpensesServiceTest extends ExpensesService{

    @Mock
    private ExpensesRepository expensesRepository;
    private ExpensesService underTest;

    private Budget budget;
    private Expenses expense;

    @BeforeEach
    void setUp() {
        underTest = new ExpensesService();
        MockitoAnnotations.openMocks(this);

        // Inject the mocked ExpensesRepository into your service
        ReflectionTestUtils.setField(underTest, "expenseRepository", expensesRepository);

        expense = new Expenses();
        expense.setExpensesDescription("tuition fees");
        expense.setExpensesDate(Instant.now());

        budget = new Budget();
        budget.setBudgetId(100L);
        budget.setBudgetDescription("study");
        budget.setBudgetAmount(1000);

        expense.setBudget(budget);
    }

    @Test
    void canGetAllExpenses() {
        List<Expenses> expensesList = Collections.singletonList(expense);
        when(expensesRepository.findAll()).thenReturn(expensesList);

        underTest.getAllExpenses();

        verify(expensesRepository).findAll();
        assertEquals(1, expensesList.size());
    }

    @Test
    void canGetExpenseById() {
        Long expenseId = expense.getExpensesId();
        when(expensesRepository.findById(expenseId)).thenReturn(Optional.of(expense));
        Expenses result = underTest.getExpenseById(expenseId);
        // Verify that findById was called with the correct ID
        verify(expensesRepository).findById(expenseId);
        assertEquals(expense.getExpensesId(), result.getExpensesId());

    }

    @Test
    void canCreateNewExpense(){
        underTest.createExpense(expense);
        ArgumentCaptor<Expenses> expensesArgumentCaptor = ArgumentCaptor.forClass(Expenses.class);

        verify(expensesRepository).save(expensesArgumentCaptor.capture());

        Expenses capturedExpense = expensesArgumentCaptor.getValue();

        assertEquals(capturedExpense, expense);

    }

    @Test
    void canUpdateExpense() {
        underTest.createExpense(expense);
        Long expenseId = 100L;
        Expenses updatedExpense = new Expenses();
        updatedExpense.setExpensesAmount(500);
        updatedExpense.setExpensesDescription("Credit");

        when(expensesRepository.findById(expenseId)).thenReturn(Optional.of(expense));

        underTest.updateExpense(expenseId, updatedExpense);

        ArgumentCaptor<Expenses> expensesArgumentCaptor = ArgumentCaptor.forClass(Expenses.class);
        //Due to number of Invocations, I need to verify that we expect 3 invocations
        verify(expensesRepository, times(3)).save(expensesArgumentCaptor.capture());

        Expenses savedExpense = expensesArgumentCaptor.getValue();

        assertNotNull(savedExpense);
        assertEquals("Credit", savedExpense.getExpensesDescription());
        assertEquals(500, savedExpense.getExpensesAmount());
    }

    @Test
    void canDeleteExpense() {
        Long expenseId = expense.getExpensesId();
        underTest.deleteExpense(expenseId);
        verify(expensesRepository, times(1)).deleteById(expenseId);
    }


}
