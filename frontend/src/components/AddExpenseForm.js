import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { calculateTotalSpent} from '../helpers/HelperFunctions';


const AddExpenseForm = ({ budgets }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [selectedBudgetId, setSelectedBudgetId] = useState(budgets.length > 0 ? budgets[0].id : '');
    const { addNewExpense, expenses } = useExpenseContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || !selectedBudgetId || !date) {
            alert("Please fill in all fields.");
            return;
        }

        const selectedBudget = budgets.find(b => b.budgetId === parseInt(selectedBudgetId, 10));
        if (!selectedBudget) {
            alert("Selected budget does not exist.");
            return;
        }

        // Use the helper function to calculate total spent
        const totalSpent = calculateTotalSpent(expenses, parseInt(selectedBudgetId, 10));
        const remaining = selectedBudget.budgetAmount - totalSpent;

        if (remaining < parseFloat(amount)) {
            const proceed = window.confirm("This expense exceeds your remaining budget. Do you want to proceed?");
            if (!proceed) return;
        }

        try {
            await addNewExpense({
                description,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                budgetId: selectedBudgetId,
            });
            setDescription('');
            setAmount('');
            setDate('');
        } catch (error) {
            console.error('Error adding expense', error);
            alert("Failed to add expense. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Expense</h2>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount"/>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date"/>
            <select value={selectedBudgetId} onChange={(e) => setSelectedBudgetId(e.target.value)}>
                <option value="">Select Budget</option>
                {budgets.map(budget => (
                    <option key={budget.budgetId} value={budget.budgetId}>{budget.budgetDescription}</option>
                ))}
            </select>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;
