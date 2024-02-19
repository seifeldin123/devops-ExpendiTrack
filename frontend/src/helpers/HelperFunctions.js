// Helper functions


// Calculating total spent on a budget
// Adjusted to use optional chaining and provide a fallback value
export const calculateTotalSpent = (expenses, budgetId) => {
    if (!Array.isArray(expenses)) return 0;
    return expenses
        .filter(expense => expense?.budget?.budgetId === budgetId)
        .reduce((total, expense) => total + parseFloat(expense.expensesAmount || 0), 0);
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