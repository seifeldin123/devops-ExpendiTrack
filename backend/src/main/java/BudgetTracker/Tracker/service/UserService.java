package BudgetTracker.Tracker.service;

import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.CustomDuplicateUserException;
import BudgetTracker.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User createNewUser(User user) {
        Optional<User> existingUser = userRepository.findByNameAndEmail(user.getName(), user.getEmail());
        if (existingUser.isPresent()) {
            throw new CustomDuplicateUserException("An account with these credentials already exists.");
        }
        return userRepository.save(user);
    }

    public Optional<User> findUserByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }

}
