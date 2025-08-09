import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { theme } from '../../theme';
import { transactionService } from '../../services/transactions';
import { budgetService } from '../../services/budget';
import { goalsService } from '../../services/goals';
import { investmentService } from '../../services/investments';

const { width } = Dimensions.get('window');

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetProgress: number;
  goalProgress: number;
  investmentValue: number;
  recentTransactions: any[];
  spendingByCategory: any[];
  monthlyTrend: any[];
}

const HomeScreen = ({ navigation }: any) => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetProgress: 0,
    goalProgress: 0,
    investmentValue: 0,
    recentTransactions: [],
    spendingByCategory: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard data from various services
      const [transactions, budgets, goals, investments] = await Promise.all([
        transactionService.getTransactions({ limit: 5 }),
        budgetService.getBudgets(),
        goalsService.getGoals(),
        investmentService.getPortfolios(),
      ]);

      // Calculate dashboard metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyTransactions = transactions.filter((t: any) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });

      const monthlyIncome = monthlyTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const monthlyExpenses = monthlyTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const totalBalance = monthlyIncome - monthlyExpenses;

      // Calculate budget progress
      const activeBudgets = budgets.filter((b: any) => b.status === 'active');
      const budgetProgress = activeBudgets.length > 0 
        ? activeBudgets.reduce((sum: number, b: any) => sum + (b.spent / b.amount * 100), 0) / activeBudgets.length
        : 0;

      // Calculate goal progress
      const activeGoals = goals.filter((g: any) => g.status === 'active');
      const goalProgress = activeGoals.length > 0
        ? activeGoals.reduce((sum: number, g: any) => sum + (g.currentAmount / g.targetAmount * 100), 0) / activeGoals.length
        : 0;

      // Calculate investment value
      const investmentValue = investments.reduce((sum: number, p: any) => sum + p.totalValue, 0);

      // Prepare spending by category data
      const categorySpending = monthlyTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((acc: any, t: any) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

      const spendingByCategory = Object.entries(categorySpending)
        .map(([name, amount]: [string, any]) => ({
          name,
          amount,
          color: getRandomColor(),
          legendFontColor: colors.text,
          legendFontSize: 12,
        }))
        .slice(0, 5);

      // Prepare monthly trend data (last 6 months)
      const monthlyTrend = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [2400, 1800, 2200, 2600, 2100, monthlyExpenses],
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 2,
        }],
      };

      setDashboardData({
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        budgetProgress,
        goalProgress,
        investmentValue,
        recentTransactions: transactions.slice(0, 5),
        spendingByCategory,
        monthlyTrend,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getRandomColor = () => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const QuickActionCard = ({ icon, title, onPress, color }: any) => (
    <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="white" />
      </View>
      <Text style={[styles.quickActionTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  const MetricCard = ({ title, value, subtitle, icon, color, onPress }: any) => (
    <TouchableOpacity style={[styles.metricCard, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color }]}>
          <Icon name={icon} size={20} color="white" />
        </View>
        <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.metricSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(dashboardData.totalBalance)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Icon name="arrow-up" size={16} color="#4CAF50" />
              <Text style={styles.incomeText}>{formatCurrency(dashboardData.monthlyIncome)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Icon name="arrow-down" size={16} color="#F44336" />
              <Text style={styles.expenseText}>{formatCurrency(dashboardData.monthlyExpenses)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="plus"
            title="Add Transaction"
            color={colors.primary}
            onPress={() => navigation.navigate('AddTransaction')}
          />
          <QuickActionCard
            icon="camera"
            title="Scan Receipt"
            color={colors.secondary}
            onPress={() => navigation.navigate('ReceiptScanner')}
          />
          <QuickActionCard
            icon="target"
            title="Create Goal"
            color={colors.accent}
            onPress={() => navigation.navigate('CreateGoal')}
          />
          <QuickActionCard
            icon="chart-line"
            title="View Reports"
            color={colors.success}
            onPress={() => navigation.navigate('Reports')}
          />
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Budget Progress"
            value={`${dashboardData.budgetProgress.toFixed(1)}%`}
            icon="wallet"
            color={colors.primary}
            onPress={() => navigation.navigate('Budget')}
          />
          <MetricCard
            title="Goals Progress"
            value={`${dashboardData.goalProgress.toFixed(1)}%`}
            icon="target"
            color={colors.secondary}
            onPress={() => navigation.navigate('Goals')}
          />
          <MetricCard
            title="Investments"
            value={formatCurrency(dashboardData.investmentValue)}
            icon="trending-up"
            color={colors.accent}
            onPress={() => navigation.navigate('Investments')}
          />
        </View>
      </View>

      {/* Spending Chart */}
      {dashboardData.spendingByCategory.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending by Category</Text>
          <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
            <PieChart
              data={dashboardData.spendingByCategory}
              width={width - 60}
              height={200}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.transactionsList, { backgroundColor: colors.surface }]}>
          {dashboardData.recentTransactions.map((transaction: any, index: number) => (
            <TouchableOpacity
              key={transaction.id || index}
              style={styles.transactionItem}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.type === 'income' ? colors.success : colors.error }]}>
                  <Icon
                    name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color="white"
                  />
                </View>
                <View>
                  <Text style={[styles.transactionTitle, { color: colors.text }]}>
                    {transaction.description || transaction.category}
                  </Text>
                  <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.type === 'income' ? colors.success : colors.error,
                  },
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  expenseText: {
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  transactionsList: {
    borderRadius: 12,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;