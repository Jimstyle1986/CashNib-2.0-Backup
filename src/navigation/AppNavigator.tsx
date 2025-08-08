import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../store/hooks';
import { theme } from '../theme';

// Import screens
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/Home/HomeScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import BudgetScreen from '../screens/Budget/BudgetScreen';
import GoalsScreen from '../screens/Goals/GoalsScreen';
import InvestmentsScreen from '../screens/Investments/InvestmentsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import AIAssistantScreen from '../screens/AI/AIAssistantScreen';

// Import detail screens
import TransactionDetailScreen from '../screens/Transactions/TransactionDetailScreen';
import AddTransactionScreen from '../screens/Transactions/AddTransactionScreen';
import BudgetDetailScreen from '../screens/Budget/BudgetDetailScreen';
import CreateBudgetScreen from '../screens/Budget/CreateBudgetScreen';
import GoalDetailScreen from '../screens/Goals/GoalDetailScreen';
import CreateGoalScreen from '../screens/Goals/CreateGoalScreen';
import InvestmentDetailScreen from '../screens/Investments/InvestmentDetailScreen';
import AddInvestmentScreen from '../screens/Investments/AddInvestmentScreen';
import PortfolioAnalysisScreen from '../screens/Investments/PortfolioAnalysisScreen';
import ReportDetailScreen from '../screens/Reports/ReportDetailScreen';

// Import modal screens
import CameraScreen from '../screens/Camera/CameraScreen';
import ReceiptScannerScreen from '../screens/Camera/ReceiptScannerScreen';
import QRCodeScannerScreen from '../screens/Camera/QRCodeScannerScreen';

// Navigation types
import { RootStackParamList, MainTabParamList, DrawerParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Tab Navigator
const TabNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'credit-card' : 'credit-card-outline';
              break;
            case 'Budget':
              iconName = focused ? 'chart-pie' : 'chart-pie';
              break;
            case 'Goals':
              iconName = focused ? 'target' : 'target';
              break;
            case 'Investments':
              iconName = focused ? 'trending-up' : 'trending-up';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen 
        name="Budget" 
        component={BudgetScreen}
        options={{ title: 'Budget' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{ title: 'Goals' }}
      />
      <Tab.Screen 
        name="Investments" 
        component={InvestmentsScreen}
        options={{ title: 'Investments' }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{
          title: 'CashNib',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          title: 'Reports',
          drawerIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="AIAssistant" 
        component={AIAssistantScreen}
        options={{
          title: 'AI Assistant',
          drawerIcon: ({ color, size }) => (
            <Icon name="robot" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <Icon name="bell" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <NavigationContainer
      theme={{
        dark: currentTheme === 'dark',
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.error,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            
            {/* Detail Screens */}
            <Stack.Screen 
              name="TransactionDetail" 
              component={TransactionDetailScreen}
              options={{
                headerShown: true,
                title: 'Transaction Details',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen 
              name="AddTransaction" 
              component={AddTransactionScreen}
              options={{
                headerShown: true,
                title: 'Add Transaction',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="BudgetDetail" 
              component={BudgetDetailScreen}
              options={{
                headerShown: true,
                title: 'Budget Details',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen 
              name="CreateBudget" 
              component={CreateBudgetScreen}
              options={{
                headerShown: true,
                title: 'Create Budget',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="GoalDetail" 
              component={GoalDetailScreen}
              options={{
                headerShown: true,
                title: 'Goal Details',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen 
              name="CreateGoal" 
              component={CreateGoalScreen}
              options={{
                headerShown: true,
                title: 'Create Goal',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="InvestmentDetail" 
              component={InvestmentDetailScreen}
              options={{
                headerShown: true,
                title: 'Investment Details',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen 
              name="AddInvestment" 
              component={AddInvestmentScreen}
              options={{
                headerShown: true,
                title: 'Add Investment',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="PortfolioAnalysis" 
              component={PortfolioAnalysisScreen}
              options={{
                headerShown: true,
                title: 'Portfolio Analysis',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen 
              name="ReportDetail" 
              component={ReportDetailScreen}
              options={{
                headerShown: true,
                title: 'Report Details',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }}
            />
            
            {/* Modal Screens */}
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen 
              name="ReceiptScanner" 
              component={ReceiptScannerScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen 
              name="QRCodeScanner" 
              component={QRCodeScannerScreen}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;