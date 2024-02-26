import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBudgetForm from '../AddBudgetForm'; // Adjust the import path as necessary
import { useBudgetContext } from '../../contexts/BudgetContext';
import { useUserContext } from '../../contexts/UserContext';

// Mock the BudgetContext and UserContext hooks
jest.mock('../../contexts/BudgetContext', () => ({
    useBudgetContext: jest.fn(),
}));

jest.mock('../../contexts/ExpenseContext', () => ({
    useExpenseContext: jest.fn(() => ({
        expenses: [], // Provide a default mock value
    })),
}));


jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

describe('AddBudgetForm', () => {
    // Define mock functions
    let mockAddNewBudget;
    let mockUpdateExistingBudget;
    let mockResetError;
    let mockFetchBudgets;

    beforeEach(() => {
        // Initialize mock functions
        mockAddNewBudget = jest.fn();
        mockUpdateExistingBudget = jest.fn();
        mockResetError = jest.fn();
        mockFetchBudgets = jest.fn();

        // Setup mock implementations
        useBudgetContext.mockImplementation(() => ({
            addNewBudget: mockAddNewBudget,
            updateExistingBudget: mockUpdateExistingBudget,
            fetchBudgets: mockFetchBudgets,
            error: '',
            resetError: mockResetError,
            setError: jest.fn(),
        }));

        useUserContext.mockImplementation(() => ({
            user: { id: 'user1' },
        }));

        // Use fake timers for all tests to control setTimeout behavior
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
        // Run real timers after each test to clean up
        jest.useRealTimers();
    });

    it('renders correctly', () => {
        render(<AddBudgetForm />);
        expect(screen.getByPlaceholderText('e.g., Groceries')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g., 500')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Budget' })).toBeInTheDocument();
    });


    it('displays a success alert on submission and hides it after 15 seconds', async () => {
        mockAddNewBudget.mockResolvedValueOnce(); // Simulate successful budget addition

        render(<AddBudgetForm />);

        // Simulate form submission
        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Groceries');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '300');
            userEvent.click(screen.getByRole('button', { name: 'Create Budget' }));
        });

        expect(screen.getByRole('alert')).toHaveTextContent('Budget successfully added!');

        // Fast-forward time by 15 seconds
        act(() => {
            jest.advanceTimersByTime(15000);
        });

        // The success alert should be removed after 15 seconds
        expect(screen.queryByRole('alert')).toBeNull();
    });

    // Test updating an existing budget
    it('updates an existing budget when form fields are filled and submit button is clicked', async () => {
        const existingBudget = { budgetId: 'budget1', budgetDescription: 'Groceries', budgetAmount: '500' };
        mockUpdateExistingBudget.mockResolvedValueOnce(); // Simulate successful budget update

        render(<AddBudgetForm existingBudget={existingBudget} />);

        // Change the budget description and amount
        await act(async () => {
            await userEvent.clear(screen.getByPlaceholderText('e.g., Groceries'));
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Utilities');
            await userEvent.clear(screen.getByPlaceholderText('e.g., 500'));
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '750');
            userEvent.click(screen.getByRole('button', { name: 'Update Budget' }));
        });

        expect(mockUpdateExistingBudget).toHaveBeenCalledWith(existingBudget.budgetId, {
            budgetDescription: 'Utilities',
            budgetAmount: 750,
            user: { id: 'user1' },
        });
    });

    // Test resetting form fields after successful submission
    it('resets form fields after successful budget submission', async () => {
        mockAddNewBudget.mockResolvedValueOnce(); // Simulate successful budget addition

        render(<AddBudgetForm />);

        // Fill out and submit the form
        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'New Budget');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '1000');
            userEvent.click(screen.getByRole('button', { name: 'Create Budget' }));
        });

        // Fast-forward to ensure any asynchronous actions are completed
        await act(async () => {
            jest.advanceTimersByTime(0);
        });

        // Assert that form fields are reset
        expect(screen.getByPlaceholderText('e.g., Groceries').value).toBe('');
        expect(screen.getByPlaceholderText('e.g., 500').value).toBe('');
    });

    // Test displaying a context-provided error message
    it('displays a context provided error message', () => {
        useBudgetContext.mockImplementation(() => ({
            addNewBudget: jest.fn(),
            updateExistingBudget: jest.fn(),
            fetchBudgets: jest.fn(),
            error: 'Network Error',
            resetError: mockResetError,
        }));

        render(<AddBudgetForm />);

        // Error message should be displayed from context
        expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    // Test updating form fields when existingBudget prop changes
    it('updates form fields when existingBudget prop changes', () => {
        const { rerender } = render(<AddBudgetForm existingBudget={{ budgetDescription: 'Groceries', budgetAmount: '500' }} />);

        // Initial values should match the existing budget
        expect(screen.getByPlaceholderText('e.g., Groceries').value).toBe('Groceries');
        expect(screen.getByPlaceholderText('e.g., 500').value).toBe('500');

        // Rerender with updated props
        rerender(<AddBudgetForm existingBudget={{ budgetDescription: 'Utilities', budgetAmount: '750' }} />);

        // Form fields should update to reflect the new props
        expect(screen.getByPlaceholderText('e.g., Groceries').value).toBe('Utilities');
        expect(screen.getByPlaceholderText('e.g., 500').value).toBe('750');
    });

});
