import React from 'react';
import { formatCurrency } from '../helpers/HelperFunctions';

const ExpenseList = React.memo(({ expenses }) => {
    if (!Array.isArray(expenses) || expenses.length === 0) {
        return <p className="text-center mt-3">No expenses available</p>;
    }

    return (
        <>
            <h2>Expenses</h2>
            <div className="table-responsive">
                <table className="table table-hover mt-3">
                    <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Budget</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.expensesId}>
                            <td>{expense.expensesDescription}</td>
                            <td>{formatCurrency(expense.expensesAmount)}</td>
                            <td>{new Date(expense.expensesDate).toLocaleDateString()}</td>
                            <td>{expense.budget.budgetDescription}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default ExpenseList;
