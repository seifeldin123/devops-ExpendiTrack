package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    private UserService underTest;

    private User user;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        underTest = new UserService(userRepository);

        user = new User();
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");

        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
        user.setBudgets(budgets);
    }

    @Test
    void canGetAllUsers() {
        //when
        underTest.getAllUsers();
        //then
        verify(userRepository).findAll();
    }


    @Test
    void canUserBeFindById() {
        // given
        Long userId = user.getId();
        // when
        underTest.findUserById(userId);
        // then
        verify(userRepository).findById(userId);
    }

    @Test
    void canUserBeFindByNameAndEmail() {
        String userName = user.getName();
        String userEmail = user.getEmail();
        underTest.findUserByNameAndEmail(userName, userEmail);
        verify(userRepository).findByNameAndEmail(userName, userEmail);
    }

    @Test
    void canAddNewUser() {
        // when
        underTest.createNewUser(user);
        // then
        ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userArgumentCaptor.capture());
        User capturedUser = userArgumentCaptor.getValue();
        assertThat(capturedUser).isEqualTo(user);
    }
}
