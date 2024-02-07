// Helper functions


// Calculating total spent on a budget
// Adjusted to use expensesAmount and match budgetId within the nested budget object
export const calculateTotalSpent = (expenses, budgetId) => {
    return expenses
        .filter(expense => expense.budget.budgetId === budgetId) // Adjusting to match the nested budgetId
        .reduce((total, expense) => total + parseFloat(expense.expensesAmount), 0); // Using expensesAmount
};


// Formatting Currency
export const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};


// Formating percentages
export const formatPercentage = (amt) => {
    return amt.toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 0,
    });
};