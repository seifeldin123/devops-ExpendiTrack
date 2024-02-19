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
                    {expenses.map((expense, index) => (
                        <tr key={expense?.expensesId || index}>
                            <td>{expense?.expensesDescription || 'No Description'}</td>
                            <td>{formatCurrency(expense?.expensesAmount || 0)}</td>
                            <td>{expense?.expensesDate ? new Date(expense.expensesDate).toLocaleDateString() : 'No Date'}</td>
                            <td>{expense?.budget?.budgetDescription || 'No Budget'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
});


export default ExpenseList;