import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = React.memo(({ expenses }) => {
    // Ensure expenses is an array before mapping
    if (!Array.isArray(expenses)) return <div>No expenses available</div>;

    return (
        <div>
            <h2>Expenses</h2>

            {expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />)}

        </div>
    );
});

export default ExpenseList;
