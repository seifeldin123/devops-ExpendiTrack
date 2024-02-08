package BudgetTracker.Tracker.exceptions;

public class DuplicateBudgetNameException extends RuntimeException {
    public DuplicateBudgetNameException(String message) {
        super(message);
    }
}
