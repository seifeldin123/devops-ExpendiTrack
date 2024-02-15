import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBudgetForm from '../AddBudgetForm'; // Adjust the import path as necessary
import { useBudgetContext } from '../../contexts/BudgetContext';
import { useUserContext } from '../../contexts/UserContext';

// At the top of your test file
jest.mock('../../contexts/BudgetContext', () => ({
    useBudgetContext: jest.fn(),
}));

jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));


describe('AddBudgetForm', () => {
    const mockAddNewBudget = jest.fn();
    const mockResetError = jest.fn();

    beforeEach(() => {
        // Setup mock implementations before each test
        useBudgetContext.mockImplementation(() => ({
            addNewBudget: mockAddNewBudget,
            error: '',
            resetError: mockResetError,
        }));

        useUserContext.mockImplementation(() => ({
            user: { id: 'user1' },
        }));

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    beforeAll(() => {
        // Mock alert before all tests
        window.alert = jest.fn();
    });

    afterAll(() => {
        // Clean up after all tests are done
        window.alert.mockRestore();
    });

    it('renders correctly', () => {
        render(<AddBudgetForm />);
        expect(screen.getByPlaceholderText('e.g., Groceries')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g., 500')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Budget' })).toBeInTheDocument();
    });

    // Create Budget with Valid Inputs
    it('submits a new budget when form fields are filled and submit button is clicked', async () => {
        render(<AddBudgetForm />);

        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Groceries');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '300');
            userEvent.click(screen.getByRole('button', {name: 'Create Budget'}));
        });

        await waitFor(() => expect(mockAddNewBudget).toHaveBeenCalledWith({
            budgetDescription: 'Groceries',
            budgetAmount: '300',
            user: { id: 'user1' },
        }));
    });

    // Create Budget without Name
    it('shows an error message when trying to submit a form without a budget name', async () => {
        window.alert = jest.fn(); // Mocking alert

        render(<AddBudgetForm />);

        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '500');
            userEvent.click(screen.getByRole('button', { name: 'Create Budget' }));
        });

        expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    });

    // Create Budget without Amount
    it('shows an error message when trying to submit a form without a budget amount', async () => {
        window.alert = jest.fn(); // Mocking alert

        render(<AddBudgetForm />);

        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Groceries');
            userEvent.click(screen.getByRole('button', { name: 'Create Budget' }));
        });

        expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    });

    // Create Budget with Invalid Amount
    it('does not submit the form with a negative amount and shows an alert', async () => {
        render(<AddBudgetForm />);

        // Attempt to enter a negative amount
        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Groceries');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '-100');
            userEvent.click(screen.getByRole('button', { name: 'Create Budget' }));
        });

        // Check if alert was called due to negative amount
        expect(window.alert).toHaveBeenCalledWith('Amount cannot be negative');
    });

    // Create Budget with Server Error
    it('displays an error message if submission fails due to server error', async () => {
        useBudgetContext.mockImplementation(() => ({
            addNewBudget: mockAddNewBudget,
            error: 'Server error occurred',
            resetError: mockResetError,
        }));

        render(<AddBudgetForm />);

        // Check for error message
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });

    //  Reset Form Fields after Submission
    it('resets form fields after successful budget submission', async () => {
        render(<AddBudgetForm />);

        // Simulate user input and form submission
        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Savings');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '2000');
            userEvent.click(screen.getByRole('button', {name: 'Create Budget'}));
        });

        // Check if input fields are reset
        expect(screen.getByPlaceholderText('e.g., Groceries').value).toBe('');
        expect(screen.getByPlaceholderText('e.g., 500').value).toBe('');
    });

    // Display Context Error
    it('displays a context provided error message', () => {
        // Override the mock to return an error state
        useBudgetContext.mockImplementation(() => ({
            addNewBudget: mockAddNewBudget,
            error: 'Network Error',
            resetError: mockResetError,
        }));

        render(<AddBudgetForm />);

        // Check for error message
        expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    // Reset Error on Form Submission
    it('calls resetError on form submission', async () => {
        render(<AddBudgetForm />);

        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('e.g., Groceries'), 'Groceries');
            await userEvent.type(screen.getByPlaceholderText('e.g., 500'), '300');
            userEvent.click(screen.getByRole('button', {name: 'Create Budget'}));
        });

        await waitFor(() => expect(mockResetError).toHaveBeenCalled());
    });

});
