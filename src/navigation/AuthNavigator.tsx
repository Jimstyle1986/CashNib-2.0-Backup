import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { theme } from '../theme';

// Import auth screens
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';
import BiometricSetupScreen from '../screens/Auth/BiometricSetupScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import TermsAndConditionsScreen from '../screens/Auth/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/Auth/PrivacyPolicyScreen';

// Navigation types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    email: string;
  };
  EmailVerification: {
    email: string;
    fromSignup?: boolean;
  };
  BiometricSetup: {
    skipable?: boolean;
  };
  Onboarding: undefined;
  TermsAndConditions: {
    fromSignup?: boolean;
  };
  PrivacyPolicy: {
    fromSignup?: boolean;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          headerShown: true,
          title: 'Sign In',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          title: 'Reset Password',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{
          headerShown: true,
          title: 'New Password',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
        options={{
          headerShown: true,
          title: 'Verify Email',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
          headerLeft: () => null, // Prevent going back
        }}
      />
      <Stack.Screen 
        name="BiometricSetup" 
        component={BiometricSetupScreen}
        options={{
          headerShown: true,
          title: 'Biometric Setup',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="TermsAndConditions" 
        component={TermsAndConditionsScreen}
        options={{
          headerShown: true,
          title: 'Terms & Conditions',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          title: 'Privacy Policy',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;