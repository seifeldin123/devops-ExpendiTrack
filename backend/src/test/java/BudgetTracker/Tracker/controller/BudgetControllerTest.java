package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateBudgetNameException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.service.BudgetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.BDDMockito.given;

@ExtendWith(SpringExtension.class)
@WebMvcTest(BudgetController.class)
class BudgetControllerTest {

    @MockBean // Use @MockBean instead of @Mock for Spring Boot's context
    private BudgetService budgetService;

    @Autowired
    private MockMvc mockMvc;

    private User user;
    private Budget budget;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setName("Seif");
        user.setEmail("Seif@hotmail.com");

        budget = new Budget();
        budget.setBudgetDescription("Holiday");
        budget.setBudgetAmount(1000);
        budget.setUser(user);
    }

    @Test
    void createBudget_Success() throws Exception {
        when(budgetService.createBudget(any(Budget.class))).thenReturn(budget);

        mockMvc.perform(post("/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(budget)))
                .andExpect(status().isCreated());

        // Verify that the createBudget method was called once
        verify(budgetService).createBudget(any(Budget.class));
    }

    @Test
    void createBudget_ThrowsDuplicateBudgetNameException() throws Exception {
        doThrow(new DuplicateBudgetNameException("Budget with name 'Holiday' already exists")).when(budgetService).createBudget(any(Budget.class));

        mockMvc.perform(post("/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(budget)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Budget with name 'Holiday' already exists")));

        // Verify that the createBudget method was called once
        verify(budgetService).createBudget(any(Budget.class));

    }

    @Test
    void createBudgetThrowsInvalidInputException() throws Exception {
        given(budgetService.createBudget(any(Budget.class))).willThrow(new InvalidInputException("Invalid input"));
        mockMvc.perform(post("/budgets")
                .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"budgetDescription\":\"Holiday\",\"budgetAmount\":\"-500\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid input")));
    }
}
