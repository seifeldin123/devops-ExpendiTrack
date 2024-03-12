// Calculating total spent on a budget
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

// Date formatting function
export const formatDate = (dateString, language) => {
    // Extract the year, month, and day from the dateString assuming YYYY-MM-DD format
    const [year, month, day] = dateString.split('T')[0].split('-').map(num => parseInt(num, 10));

    // Create a new Date object using local time zone ensuring time is set to start of the day
    const date = new Date(year, month - 1, day);

    // Format the date as needed, for example, toLocaleDateString()
    const formatter =  Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return formatter.format(date);
};
