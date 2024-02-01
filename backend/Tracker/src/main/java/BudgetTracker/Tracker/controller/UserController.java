package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createNewUser(user);
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