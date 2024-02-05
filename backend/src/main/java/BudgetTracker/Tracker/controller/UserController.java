package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateUserException;
import BudgetTracker.Tracker.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createNewUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED); // Use CREATED status for new resources
        } catch (DuplicateUserException e) { // Catch your custom exception
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/find")
    public ResponseEntity<?> findUser(@RequestParam String name, @RequestParam String email) {
        Optional<User> userOpt = userService.findUserByNameAndEmail(name, email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            // Instead of returning 404, return a custom message or status
            return ResponseEntity.status(HttpStatus.OK).body("User not found. Proceed with creation.");
        }
    }
}