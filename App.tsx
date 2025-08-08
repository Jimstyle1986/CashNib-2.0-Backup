import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeFirebase } from './src/services/firebase';
import LoadingScreen from './src/components/common/LoadingScreen';
import { colors } from './src/theme/colors';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Firebase
    initializeFirebase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={colors.background.primary}
              translucent={false}
            />
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;