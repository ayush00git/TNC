import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import client from './client';

export const getPushToken = async () => {
    try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        return tokenData.data;
    } catch (error) {
        console.log('Error getting push token:', error);
        return null;
    }
};

export const syncPushToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const pushToken = await getPushToken();
        if (pushToken) {
            await client.post('/api/auth/save-token', { token: pushToken });
            console.log('Push token synced successfully');
        }
    } catch (error) {
        console.error('Failed to sync push token:', error);
    }
};
