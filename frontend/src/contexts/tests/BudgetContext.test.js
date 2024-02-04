import { renderHook, act } from '@testing-library/react';
import { BudgetProvider, useBudget } from '../BudgetContext';
import * as BudgetService from '../../services/BudgetService';

jest.mock('../../services/BudgetService');

describe('BudgetContext', () => {
    beforeEach(() => {
        BudgetService.getUserBudgets.mockResolvedValue({ data: [{ id: 1, amount: 500 }] });
        BudgetService.createBudget.mockResolvedValue({ data: { id: 2, amount: 300 } });
    });

    it('loads user budgets and updates on successful fetch', async () => {
        const wrapper = ({ children }) => <BudgetProvider>{children}</BudgetProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useBudget(), { wrapper });

        act(() => {
            result.current.loadUserBudgets(1);
        });

        await waitForNextUpdate();

        expect(result.current.budgets).toEqual([{ id: 1, amount: 500 }]);
    });

    it('adds a new budget and updates the state', async () => {
        const wrapper = ({ children }) => <BudgetProvider>{children}</BudgetProvider>;
        const { result } = renderHook(() => useBudget(), { wrapper });

        await act(async () => {
            await result.current.addBudget({ id: 2, amount: 300 });
        });

        expect(result.current.budgets).toContainEqual({ id: 2, amount: 300 });
    });
});
