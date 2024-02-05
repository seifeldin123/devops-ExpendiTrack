package BudgetTracker.Tracker.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global exception handler for the application, providing centralized exception handling across all {@code @RequestMapping} methods.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handles CustomDuplicateUserException. This method is invoked when an exception of type CustomDuplicateUserException is thrown.
     *
     * @param ex      the exception that was thrown.
     * @param request the current web request.
     * @return a {@link ResponseEntity} object containing the custom error message and the HTTP status code.
     */
    @ExceptionHandler(DuplicateUserException.class)
    protected ResponseEntity<Object> handleDuplicateUser(
            DuplicateUserException ex, WebRequest request) {
        String bodyOfResponse = "An account with these credentials already exists.";
        return handleExceptionInternal(ex, bodyOfResponse,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }


    @ExceptionHandler(DuplicateBudgetNameException.class)
    public ResponseEntity<?> handleDuplicateBudgetNameException(DuplicateBudgetNameException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
