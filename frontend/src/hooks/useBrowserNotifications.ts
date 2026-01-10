import { useState, useEffect, useCallback } from 'react';

export function useBrowserNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Check if browser supports notifications
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return 'denied';
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    }, []);

    const showNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/tnc-logo.png',
                badge: '/tnc-logo.png',
                ...options,
            });

            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000);

            return notification;
        }
        return null;
    }, []);

    return {
        permission,
        requestPermission,
        showNotification,
        isSupported: 'Notification' in window,
    };
}
