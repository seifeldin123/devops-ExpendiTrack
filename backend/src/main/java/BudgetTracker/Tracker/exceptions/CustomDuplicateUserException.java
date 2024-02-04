package BudgetTracker.Tracker.exceptions;

/**
 * Custom exception that should be thrown when attempting to create a duplicate user.
 */
public class CustomDuplicateUserException extends RuntimeException {
    /**
     * Constructor for CustomDuplicateUserException.
     *
     * @param message the detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
     */
    public CustomDuplicateUserException(String message) {
        super(message);
    }
}
