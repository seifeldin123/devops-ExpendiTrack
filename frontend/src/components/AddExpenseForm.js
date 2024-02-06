import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';

const AddExpenseForm = ({ budgets }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedBudgetId, setSelectedBudgetId] = useState(budgets.length > 0 ? budgets[0].id : '');
    const [date, setDate] = useState(''); // Add state for date
    const { addNewExpense } = useExpenseContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || !selectedBudgetId || !date) {
            alert("Please fill in all fields.");
            return;
        }

        const selectedBudget = budgets.find(b => b.id === parseInt(selectedBudgetId, 10));
        if (!selectedBudget) {
            alert("Selected budget does not exist.");
            return;
        }

        try {
            // Add expense with date
            await addNewExpense({
                description,
                amount: parseFloat(amount),
                budgetId: selectedBudgetId,
                date: new Date(date).toISOString() // Convert the date to ISO string format
            });
            // Reset form fields
            setDescription('');
            setAmount('');
            setDate('');
        } catch (error) {
            console.error('Error adding expense', error);
            alert("Failed to add expense. Please try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Expense</h2>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Date"
            />
            <select
                value={selectedBudgetId}
                onChange={(e) => setSelectedBudgetId(e.target.value)}
            >
                <option value="">Select Budget</option>
                {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>{budget.description}</option>
                ))}
            </select>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;
