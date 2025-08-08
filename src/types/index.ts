// User types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  period: 'weekly' | 'monthly' | 'yearly';
  totalAmount: number;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryName: string;
  allocatedAmount: number;
  spentAmount: number;
  color: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  description: string;
  isManual: boolean;
  isIncome: boolean;
  accountId?: string;
  tags?: string[];
  location?: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  isIncome: boolean;
  subcategories?: string[];
}

// Goal types
export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category: 'emergency' | 'vacation' | 'retirement' | 'purchase' | 'debt' | 'other';
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Investment types
export interface Investment {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual_fund';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  purchaseDate: string;
  lastUpdated: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investments: Investment[];
  lastUpdated: string;
}

export interface InvestmentRecommendation {
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'crypto' | 'bond';
  recommendedAllocation: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  reason: string;
}

// Account types
export interface BankAccount {
  id: string;
  userId: string;
  accountId: string;
  institutionName: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  lastSynced: string;
  plaidAccessToken?: string;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  planType: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  stripeSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'goal_milestone' | 'transaction_anomaly' | 'investment_update' | 'general';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// AI types
export interface AIInsight {
  id: string;
  userId: string;
  type: 'budget_suggestion' | 'spending_pattern' | 'investment_advice' | 'goal_recommendation';
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  isActionable: boolean;
  actionTaken: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface BudgetChartData {
  categories: ChartDataPoint[];
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

export interface SpendingTrendData {
  period: string;
  data: TimeSeriesDataPoint[];
  comparison?: {
    previousPeriod: TimeSeriesDataPoint[];
    percentageChange: number;
  };
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Onboarding types
export interface OnboardingData {
  monthlyIncome: number;
  monthlyExpenses: number;
  financialGoals: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentExperience: 'beginner' | 'intermediate' | 'advanced';
  primaryFinancialConcern: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TransactionDetail: { transactionId: string };
  AddTransaction: undefined;
  BudgetDetail: { budgetId: string };
  CreateBudget: undefined;
  GoalDetail: { goalId: string };
  CreateGoal: undefined;
  InvestmentDetail: { investmentId: string };
  AddInvestment: undefined;
  PortfolioAnalysis: undefined;
  ReportDetail: { reportId: string };
  Camera: undefined;
  ReceiptScanner: undefined;
  QRCodeScanner: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
  Investments: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Reports: undefined;
  AIAssistant: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string; email: string };
  EmailVerification: { email: string; fromSignup?: boolean };
  BiometricSetup: { skipable?: boolean };
  Onboarding: undefined;
  TermsAndConditions: { fromSignup?: boolean };
  PrivacyPolicy: { fromSignup?: boolean };
};

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Settings types
export interface AppSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    budgetAlerts: boolean;
    goalMilestones: boolean;
    transactionAnomalies: boolean;
    investmentUpdates: boolean;
    marketNews: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  security: {
    biometricAuth: boolean;
    autoLock: boolean;
    autoLockTimeout: number; // in minutes
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};