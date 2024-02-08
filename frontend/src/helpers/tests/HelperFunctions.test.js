import { calculateTotalSpent, formatCurrency, formatPercentage } from '../HelperFunctions';

describe('calculateTotalSpent', () => {
    it('calculates the total expenses amount for a given budget ID', () => {
        const expenses = [
            { budget: { budgetId: 1 }, expensesAmount: '100.00' },
            { budget: { budgetId: 1 }, expensesAmount: '200.50' },
            { budget: { budgetId: 2 }, expensesAmount: '300.00' }
        ];
        const budgetId = 1;
        const totalSpent = calculateTotalSpent(expenses, budgetId);
        expect(totalSpent).toBe(300.50);
    });

    describe('formatCurrency', () => {
        it('formats a number as USD currency', () => {
            const amount = 1234.56;
            const formatted = formatCurrency(amount);
            // The exact formatted string might vary by environment, so adjust as necessary
            expect(formatted).toBe('$1,234.56');
        });
    });

    describe('formatPercentage', () => {
        it('formats a decimal as a percentage', () => {
            const amt = 0.1234;
            const formatted = formatPercentage(amt);
            // The output might vary slightly based on the environment, especially regarding rounding
            expect(formatted).toBe('12%');
        });
    });
});

