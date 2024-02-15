package BudgetTracker.Tracker.exceptions;

public class DuplicateExpenseNameException extends RuntimeException {
    public DuplicateExpenseNameException(String message) {
        super(message);
    }
}