import React, {useState} from 'react';
import {render, act, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetProvider, useBudgetContext } from '../BudgetContext';
import { useUserContext } from '../UserContext';
import { createBudget, getBudgetsByUserId } from '../../services/budgetService';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Mock the UserContext
jest.mock('../UserContext');

jest.mock('../../services/BudgetService', () => ({
    createBudget: jest.fn(),
    getBudgetsByUserId: jest.fn()
}));


jest.mock('axios');


describe('BudgetProvider', () => {
    let mock;
    const API_URL = 'http://localhost:8080/budgets';

    const mockUser = { id: 1, name: 'Test User' };
    const mockBudgets = [
        { id: 1, budgetDescription: 'Budget 1', budgetAmount: 100 },
        { id: 2, budgetDescription: 'Budget 2', budgetAmount: 200 },
    ];

    beforeEach(() => {
        // // Reset mocks before each test
        jest.clearAllMocks();

        // Mock the useUserContext hook to return the mockUser
        useUserContext.mockReturnValue({ user: mockUser });

        // Initialize the mock adapter
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        // Reset the mock after each test
        mock.reset();
    });

    it('TC_I_001: Verifies BudgetProvider Component Creation', async () => {
        // Ensure getBudgetsByUserId doesn't cause the component to crash
        getBudgetsByUserId.mockResolvedValue({ data: [] });

        await act(async () => {
            const { container } = render(<BudgetProvider><div>Test Child</div></BudgetProvider>);
            expect(container).toBeInTheDocument();
        });
    });


    it('TC_I_002: Verifies BudgetContext Availability', async () => {
        const TestComponent = () => {
            const context = useBudgetContext();
            expect(context).toBeDefined();
            return <div>Context Test</div>;
        };

        getBudgetsByUserId.mockResolvedValue({data: []});

        await act(async () => {
            render(<BudgetProvider><TestComponent/></BudgetProvider>);
        });
        expect(screen.getByText('Context Test')).toBeInTheDocument();
        expect(screen.getByText('Context Test')).toBeInTheDocument();
    });

    it('TC_I_003: Verifies Budgets State Initialization', async () => {

        const TestComponent = () => {
            const {budgets} = useBudgetContext();
            expect(budgets).toEqual([]);
            return <div>Initialization Successful</div>;
        };
        // Mock to resolve immediately as this test doesn't depend on actual data
        getBudgetsByUserId.mockResolvedValue({data: []});

        await act(async () => {
            render(
                <BudgetProvider>
                    <TestComponent/>
                </BudgetProvider>
            );
        });
        expect(screen.getByText('Initialization Successful')).toBeInTheDocument();
    });

    // Splitting fetch tests for specific scenarios
    it('TC_I_004: Verifies Fetching Budgets by User ID', async () => {
        getBudgetsByUserId.mockResolvedValue({ data: mockBudgets });

        const TestComponent = () => {
            const { budgets } = useBudgetContext();
            return (
                <>
                    {budgets.map((budget) => (
                        <div key={budget.id}>{budget.budgetDescription}</div>
                    ))}
                </>
            );
        };

        await act(async () => {
            render(
                <BudgetProvider>
                    <TestComponent />
                </BudgetProvider>
            );
        });

        expect(screen.getByText('Budget 1')).toBeInTheDocument();
        expect(screen.getByText('Budget 2')).toBeInTheDocument();
    });

    it('TC_I_005: Verifies Adding a New Budget', async () => {
        // Initial state with no budgets
        getBudgetsByUserId.mockResolvedValue({ data: [] });
        const newBudget = { id: 3, budgetDescription: 'New Budget', budgetAmount: 300 };
        createBudget.mockResolvedValue(newBudget);

        await act(async () => {
            render(<BudgetProvider><BudgetDisplay /></BudgetProvider>);
        });

        await act(async () => {
            await userEvent.type(screen.getByPlaceholderText('Budget Title'), newBudget.budgetDescription);
            await userEvent.type(screen.getByPlaceholderText('Budget Amount'), newBudget.budgetAmount.toString());
            userEvent.click(screen.getByRole('button', { name: 'Add Budget' }));
        });

        expect(screen.getByText(newBudget.budgetDescription)).toBeInTheDocument();
    });

    it('TC_I_006: Verifies Error Handling for Adding a New Budget with Invalid Data', async () => {
        const errorMessage = 'A budget with the name "School" already exists for this user.';
        createBudget.mockRejectedValue({ response: { status: 400, data: errorMessage }});

        render(<BudgetProvider><BudgetDisplay/></BudgetProvider>);

        // Assuming BudgetDisplay component has input for budget name and a submit button
        await userEvent.type(screen.getByPlaceholderText('Budget Title'), 'School');
        await userEvent.click(screen.getByRole('button', { name: 'Add Budget' }));

        // Adjust to use async waitFor for expecting error message to be in the document
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        // Ensure createBudget was called with expected parameters
        expect(createBudget).toHaveBeenCalledWith(expect.objectContaining({ budgetDescription: 'School' }));
    });




    it('TC_I_007: Verifies Fetching Budgets for a User', async () => {
        const mockBudgets = [
            { id: 1, budgetDescription: 'Budget 1', budgetAmount: 100 },
            { id: 2, budgetDescription: 'Budget 2', budgetAmount: 200 }
        ];
        // Mock getBudgetsByUserId to resolve with mockBudgets
        getBudgetsByUserId.mockResolvedValue({ data: mockBudgets });

        render(<BudgetProvider><BudgetDisplay /></BudgetProvider>);

        // Wait for the budgets to be fetched and displayed
        await waitFor(() => {
            mockBudgets.forEach((budget) => {
                expect(screen.getByText(budget.budgetDescription)).toBeInTheDocument();
            });
        });
    });


    it('TC_I_008: Verifies Error Handling for Fetching Budgets with an Invalid User ID', async () => {
        const invalidUserId = 9999; // Example of an invalid user ID
        const errorMessage = 'Error fetching budgets'; // The error message you expect to receive

        // Use MockAdapter to mock the specific axios call
        mock.onGet(`${API_URL}/user/${invalidUserId}`).reply(404, { message: errorMessage });

        // Then, inside your component or context that uses getBudgetsByUserId,
        // you would handle the error. This part of the test checks that the component
        // correctly updates its state and renders the error message based on the rejected promise.

        // Render the component that should display the error
        render(<BudgetProvider><BudgetDisplay /></BudgetProvider>);

        // Wait for the error message to appear in the DOM
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });



});

function BudgetDisplay() {
    const { budgets, addNewBudget, error } = useBudgetContext();
    const [budgetDescription, setBudgetDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');

    const handleAddBudget = () => {
        addNewBudget({ budgetDescription, budgetAmount: Number(budgetAmount) });
    };

    return (
        <div>
            {error && <div><p>{error}</p></div>}
            {budgets.map((budget) => (
                <div key={budget.id}>{budget.budgetDescription}</div>
            ))}
            <input
                placeholder="Budget Title"
                value={budgetDescription}
                onChange={(e) => setBudgetDescription(e.target.value)}
            />
            <input
                placeholder="Budget Amount"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
            />
            <button onClick={handleAddBudget}>Add Budget</button>
        </div>
    );
}
