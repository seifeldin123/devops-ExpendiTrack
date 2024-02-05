import React, { useState } from 'react';
import { useBudgetContext } from '../contexts/BudgetContext';
import { useUserContext } from '../contexts/UserContext';

const AddBudgetForm = () => {
    const [budgetDescription, setBudgetDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const { addNewBudget, error, resetError } = useBudgetContext(); // Use error from context
    const { user } = useUserContext(); // Get the current user

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError(); // Reset any previous error from context
        if (!budgetDescription || !budgetAmount) {
            // Use local setError for form validation errors
            alert('Please fill in all fields');
            return;
        }

        try {
            await addNewBudget({ budgetDescription, budgetAmount, user: { id: user.id } });
            setBudgetDescription('');
            setBudgetAmount('');
            // No need to reset error here since successful submission will not set an error
        } catch (serverError) {
            // Error handling is now more focused on server responses
            // `serverError` is already being set in the context, so no need to set it here
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <h2>Create Budget</h2>
            <input
                type="text"
                value={budgetDescription}
                onChange={(e) => setBudgetDescription(e.target.value)}
                placeholder="e.g., Groceries"
            />
            <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="e.g., 500"
            />
            <button type="submit">Create Budget</button>
        </form>
    );
};

export default AddBudgetForm;
