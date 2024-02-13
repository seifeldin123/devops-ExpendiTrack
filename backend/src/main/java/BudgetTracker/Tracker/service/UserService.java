package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateUserException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private  UserRepository userRepository;

    public boolean existsById(Long userId) {
        return userRepository.existsById(userId);
    }

    public User createNewUser(User user) {
        // Validate alphanumeric name
        if (!isValidAlphanumeric(user.getName())) {
            throw new InvalidInputException("Name must be alphanumeric");
        }

        // Validate email format
        if (!isValidEmailFormat(user.getEmail())) {
            throw new InvalidInputException("Invalid email format");
        }
        Optional<User> existingUser = userRepository.findByNameAndEmail(user.getName(), user.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateUserException("An account with these credentials already exists.");
        }
        return userRepository.save(user);
    }

    public Optional<User> findUserByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }

    // Method to validate alphanumeric name
    private boolean isValidAlphanumeric(String name) {
        return name!=null && name.matches("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
    }

    // Method to validate email format
    private boolean isValidEmailFormat(String email) {
        // Trim the email string to remove leading and trailing whitespace characters
        email = email.trim();
        // Regular expression for email validation
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(regex);
    }
}
