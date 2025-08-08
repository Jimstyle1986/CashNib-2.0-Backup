import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common selectors
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useBudgets = () => {
  return useAppSelector((state) => state.budget.budgets);
};

export const useActiveBudget = () => {
  return useAppSelector((state) => state.budget.activeBudget);
};

export const useTransactions = () => {
  return useAppSelector((state) => state.transactions.transactions);
};

export const useRecentTransactions = (limit: number = 10) => {
  return useAppSelector((state) => {
    const transactions = state.transactions.transactions;
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  });
};

export const useGoals = () => {
  return useAppSelector((state) => state.goals.goals);
};

export const useActiveGoals = () => {
  return useAppSelector((state) => {
    return state.goals.goals.filter(goal => !goal.isCompleted);
  });
};

export const usePortfolio = () => {
  return useAppSelector((state) => state.investments.portfolio);
};

export const useInvestments = () => {
  return useAppSelector((state) => state.investments.investments);
};

export const useNotifications = () => {
  return useAppSelector((state) => state.notifications.notifications);
};

export const useUnreadNotifications = () => {
  return useAppSelector((state) => {
    return state.notifications.notifications.filter(notification => !notification.isRead);
  });
};

export const useSettings = () => {
  return useAppSelector((state) => state.settings);
};

export const useTheme = () => {
  return useAppSelector((state) => state.settings.theme);
};

export const useCurrency = () => {
  return useAppSelector((state) => state.settings.currency);
};

export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

export const useLoading = (key?: string) => {
  return useAppSelector((state) => {
    if (key) {
      return state.ui.loading[key] || false;
    }
    return Object.values(state.ui.loading).some(loading => loading);
  });
};

export const useError = (key?: string) => {
  return useAppSelector((state) => {
    if (key) {
      return state.ui.errors[key] || null;
    }
    return state.ui.errors;
  });
};