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

    it('renders correctly', () => {
        render(<AddBudgetForm />);
        expect(screen.getByPlaceholderText('e.g., Groceries')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g., 500')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Budget' })).toBeInTheDocument();
    });

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
