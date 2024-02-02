package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void test_createUser() throws Exception {
        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        User user = new User();
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");
        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
        user.setBudgets(budgets);

        // createUser method in UserService returns the user
        Mockito.when(userService.createNewUser(any(User.class))).thenReturn(user);

        ObjectMapper objectMapper = new ObjectMapper();
        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk()); // Check if the response status is 200 OK
    }

    @Test
    public void test_getUserById() throws Exception {
        //create a new User
        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        User user = new User();
        user.setId(100l);
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");
        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
        user.setBudgets(budgets);

        // createUser method in UserService returns the user object
        Mockito.when(userService.findUserById(100l)).thenReturn(user);

        ObjectMapper objectMapper = new ObjectMapper();
//        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(get("/users/{id}", 100L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Verifies that the response status is HTTP 200 OK
                .andExpect(content().json("{\"id\":100,\"name\":\"sanyadrian\",\"email\":\"sanyadrian@example.com\"}"));
    }

    @Test
    public void test_getAllUsers() throws Exception {
        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        User user = new User();
        user.setId(100l);
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");
        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
        user.setBudgets(budgets);
        List<User> users = new ArrayList<>();
        users.add(user);

        // createUser method in UserService returns the user object
        Mockito.when(userService.getAllUsers()).thenReturn(users);


        mockMvc.perform(get("/users")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Verifies that the response status is HTTP 200 OK
                .andExpect(content().json("[{\"id\":100,\"name\":\"sanyadrian\",\"email\":\"sanyadrian@example.com\",\"budgets\":[{\"budgetAmount\":1000}]}]")); // Verifies the JSON response

    }

    @Test
    public void testFindUserWhenUserFound() throws Exception {
        // Create a new User
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setEmail("john.doe@example.com");

        // Mock the service layer to return an Optional of user
        Mockito.when(userService.findUserByNameAndEmail("John Doe", "john.doe@example.com"))
                .thenReturn(Optional.of(user));

        // Perform the GET request and assert the response
        mockMvc.perform(get("/users/find")
                        .param("name", "John Doe")
                        .param("email", "john.doe@example.com")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.name").value(user.getName()))
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

}

