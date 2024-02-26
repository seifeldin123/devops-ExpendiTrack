package BudgetTracker.Tracker.controller;

import BudgetTracker.Tracker.entity.User;
import BudgetTracker.Tracker.exceptions.DuplicateUserException;
import BudgetTracker.Tracker.exceptions.InvalidInputException;
import BudgetTracker.Tracker.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
/**
 * Controller class for handling HTTP requests related to users.
 * Provides endpoints for creating users and finding users by name and email.
 */
@RestController
@RequestMapping("/users")
public class UserController {
    /**
     * Constructor for UserController.
     *
     * @param userService The UserService instance to be used for user-related operations.
     */
    @Autowired
    private  UserService userService;


    /**
     * Endpoint for creating a new user.
     *
     * @param user The user object to be created. Must be provided in the request body.
     * @return ResponseEntity containing the created user if successful, or an error message with a
     * bad request status if the user already exists or if input is invalid.
     */
    @PostMapping
    @Operation(summary = "Create a new user", description = "Create a user with provided user name and user email", responses = {
            @ApiResponse(description = "User created successfully", responseCode = "201",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(description = "Bad Request", responseCode = "400",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createNewUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (DuplicateUserException e) {
            // Specific handling for duplicate user
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (InvalidInputException e) {
            // Handling for invalid input exception
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }catch (DataIntegrityViolationException e) {
            // Fallback for other data integrity issues, including unique constraint violations not caught by DuplicateUserException
            return ResponseEntity.badRequest().body("A user with the provided name or email already exists.");
        }
    }

    /**
     * Endpoint for finding a user by name and email.
     *
     * @param name  The name of the user to find.
     * @param email The email of the user to find.
     * @return ResponseEntity containing the found user if present, or a custom message with a
     * status indicating that the user was not found.
     */
    @GetMapping("/find")
    @Operation(summary = "Find a user by name and email", responses = {
            @ApiResponse(description = "User found", responseCode = "200", content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(description = "User not found", responseCode = "200", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> findUser(@Parameter(name="name", description = "Name of the user to find", example="Sasha") @RequestParam String name,
                                      @Parameter(name="email", description = "Email of the user to find", example = "test@gmail.com") @RequestParam String email) {
        Optional<User> userOpt = userService.findUserByNameAndEmail(name, email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            // Instead of returning 404, return a custom message or status
            return ResponseEntity.status(HttpStatus.OK).body("User not found. Proceed with creation.");
        }
    }
}