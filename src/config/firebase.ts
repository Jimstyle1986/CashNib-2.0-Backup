import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getMessaging, Messaging } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'cashnib-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'cashnib-app',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'cashnib-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF123456',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with persistence
let auth: Auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Firebase Storage
const storage: FirebaseStorage = getStorage(app);

// Initialize Firebase Functions
const functions: Functions = getFunctions(app);

// Initialize Firebase Analytics (web only)
let analytics: Analytics | null = null;
if (Platform.OS === 'web') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firebase Messaging (web only)
let messaging: Messaging | null = null;
if (Platform.OS === 'web') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging not supported in this environment');
  }
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  INVESTMENTS: 'investments',
  NOTIFICATIONS: 'notifications',
  CATEGORIES: 'categories',
  ACCOUNTS: 'accounts',
  SUBSCRIPTIONS: 'subscriptions',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  FEEDBACK: 'feedback',
  SUPPORT_TICKETS: 'support_tickets',
} as const;

// Storage paths
export const STORAGE_PATHS = {
  RECEIPTS: 'receipts',
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
  EXPORTS: 'exports',
  BACKUPS: 'backups',
} as const;

// Cloud Functions
export const FUNCTIONS = {
  // Auth functions
  VERIFY_EMAIL: 'verifyEmail',
  SEND_PASSWORD_RESET: 'sendPasswordReset',
  DELETE_USER_ACCOUNT: 'deleteUserAccount',
  
  // Transaction functions
  CATEGORIZE_TRANSACTION: 'categorizeTransaction',
  DETECT_ANOMALIES: 'detectAnomalies',
  IMPORT_TRANSACTIONS: 'importTransactions',
  EXPORT_TRANSACTIONS: 'exportTransactions',
  
  // Budget functions
  OPTIMIZE_BUDGET: 'optimizeBudget',
  GENERATE_BUDGET_INSIGHTS: 'generateBudgetInsights',
  
  // Goals functions
  GENERATE_SAVINGS_PLAN: 'generateSavingsPlan',
  CALCULATE_GOAL_PROJECTIONS: 'calculateGoalProjections',
  
  // Investment functions
  GET_MARKET_DATA: 'getMarketData',
  ANALYZE_PORTFOLIO: 'analyzePortfolio',
  GET_INVESTMENT_RECOMMENDATIONS: 'getInvestmentRecommendations',
  
  // AI functions
  GENERATE_INSIGHTS: 'generateInsights',
  CHAT_WITH_AI: 'chatWithAI',
  ANALYZE_SPENDING_PATTERNS: 'analyzeSpendingPatterns',
  
  // Notification functions
  SEND_NOTIFICATION: 'sendNotification',
  SCHEDULE_NOTIFICATION: 'scheduleNotification',
  
  // Report functions
  GENERATE_REPORT: 'generateReport',
  EXPORT_DATA: 'exportData',
} as const;

// Firebase error messages
export const FIREBASE_ERROR_CODES = {
  // Auth errors
  'auth/user-not-found': 'No user found with this email address.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/requires-recent-login': 'Please log in again to perform this action.',
  
  // Firestore errors
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested document was not found.',
  'already-exists': 'The document already exists.',
  'resource-exhausted': 'Quota exceeded. Please try again later.',
  'failed-precondition': 'The operation was rejected due to a failed precondition.',
  'aborted': 'The operation was aborted due to a conflict.',
  'out-of-range': 'The operation was attempted past the valid range.',
  'unimplemented': 'This operation is not implemented or supported.',
  'internal': 'Internal error occurred.',
  'unavailable': 'The service is currently unavailable.',
  'data-loss': 'Unrecoverable data loss or corruption.',
  
  // Storage errors
  'storage/object-not-found': 'File not found.',
  'storage/bucket-not-found': 'Storage bucket not found.',
  'storage/project-not-found': 'Project not found.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/unauthenticated': 'User is not authenticated.',
  'storage/unauthorized': 'User is not authorized to perform this action.',
  'storage/retry-limit-exceeded': 'Maximum retry time exceeded.',
  'storage/invalid-checksum': 'File checksum does not match.',
  'storage/canceled': 'Operation was canceled.',
  'storage/invalid-event-name': 'Invalid event name.',
  'storage/invalid-url': 'Invalid URL.',
  'storage/invalid-argument': 'Invalid argument.',
  'storage/no-default-bucket': 'No default bucket found.',
  'storage/cannot-slice-blob': 'Cannot slice blob.',
  'storage/server-file-wrong-size': 'Server file wrong size.',
} as const;

// Helper function to get user-friendly error messages
export const getFirebaseErrorMessage = (errorCode: string): string => {
  return FIREBASE_ERROR_CODES[errorCode as keyof typeof FIREBASE_ERROR_CODES] || 'An unexpected error occurred.';
};

// Validate Firebase configuration
export const validateFirebaseConfig = (): boolean => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  for (const field of requiredFields) {
    if (!firebaseConfig[field as keyof typeof firebaseConfig] || 
        firebaseConfig[field as keyof typeof firebaseConfig] === `your-${field}`) {
      console.warn(`Firebase configuration missing or invalid: ${field}`);
      return false;
    }
  }
  
  return true;
};

// Validate configuration on initialization
if (!validateFirebaseConfig()) {
  console.warn('Firebase configuration is incomplete. Please check your environment variables.');
}

// Export Firebase services
export {
  app,
  auth,
  db,
  storage,
  functions,
  analytics,
  messaging,
  firebaseConfig,
};

// Default export
export default app;