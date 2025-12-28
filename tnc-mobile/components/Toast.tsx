import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
    onHide: () => void;
}

export default function Toast({ message, type, visible, onHide }: ToastProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 50, // Top margin
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (visible) onHide();
        });
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return 'rgba(16, 185, 129, 0.9)'; // emerald-500
            case 'error': return 'rgba(239, 68, 68, 0.9)';   // red-500
            case 'info': return 'rgba(59, 130, 246, 0.9)';   // blue-500
            default: return 'rgba(30, 41, 59, 0.9)';
        }
    };

    const getIconName = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'info': return 'info';
            default: return 'info';
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: getBackgroundColor()
                }
            ]}
        >
            <Feather name={getIconName()} size={20} color="#fff" style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        width: width * 0.9,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        zIndex: 9999, // Ensure it's above everything
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    icon: {
        marginRight: 12,
    },
    message: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
});
