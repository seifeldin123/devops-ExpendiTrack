package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.Budget;
import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateUserException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService underTest;

    private User user;
    @BeforeEach
    void setUp() {
        user = new User();
        user.setName("sanyadrian");
        user.setEmail("sanyadrian@example.com");

        Budget budget = new Budget();
        budget.setBudgetAmount(1000);

        Set<Budget> budgets = new HashSet<>();
        budgets.add(budget);
//        user.setBudgets(budgets);
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

    @Test
    void createNewUserInvalidInputExceptions() {
        User user = new User();
        user.setName("");
        user.setEmail("sanyadrian@ukr.net");
        assertThrows(InvalidInputException.class, ()-> underTest.createNewUser(user),
        "name should be alphanumeric");

    }

    @Test
    void createNewUserInvalidEmailFormatException () {
        User user = new User();
        user.setName("Sasha");
        user.setEmail("sany");
        assertThrows(InvalidInputException.class, ()-> underTest.createNewUser(user),
                "Incorrect email format");
    }

    @Test
    void createNewUserDuplicateUserException () {
        User user = new User();
        user.setName("Sasha");
        user.setEmail("sanyadrian@ukr.net");
        when(userRepository.findByNameAndEmail("Sasha", "sanyadrian@ukr.net"))
                .thenReturn(Optional.of(new User()));
        assertThrows(DuplicateUserException.class, ()-> underTest.createNewUser(user),
                "A user with the given name and email exists");
    }
}
