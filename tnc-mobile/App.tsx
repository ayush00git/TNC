import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ChatScreen from './screens/ChatScreen';
import RoomScreen from './screens/RoomScreen';

import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

import { ToastProvider } from './context/ToastContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { useState, useEffect } from 'react';
import { usePushNotifications } from './hooks/usePushNotifications';
import client from './services/client';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const syncPushToken = async () => {
      if (!expoPushToken) return;
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await client.post('/api/auth/save-token', { token: expoPushToken });
          // console.log("Push token synced with backend");
        }
      } catch (e) {
        console.error("Failed to sync push token:", e);
      }
    };
    syncPushToken();
  }, [expoPushToken]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute('Room');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
        setInitialRoute('Welcome');
      }
    };
    checkToken();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#060010', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#060010' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

          <Stack.Screen name="Room" component={RoomScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}