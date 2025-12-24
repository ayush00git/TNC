import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface AttachmentModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectImage: () => void;
    onSelectCode: () => void;
}

export default function AttachmentModal({ visible, onClose, onSelectImage, onSelectCode }: AttachmentModalProps) {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [showModal, setShowModal] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 15,
                    stiffness: 150,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0.5,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start(() => setShowModal(false));
        }
    }, [visible]);

    if (!showModal) return null;

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <Animated.View style={[
                    styles.modalContent,
                    {
                        opacity,
                        transform: [{ scale }]
                    }
                ]}>
                    <TouchableOpacity style={styles.option} onPress={onSelectCode}>
                        <View style={[styles.iconContainer, { backgroundColor: '#10b98115' }]}>
                            <Feather name="code" size={20} color="#10b981" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={onSelectImage}>
                        <View style={[styles.iconContainer, { backgroundColor: '#6366f115' }]}>
                            <Ionicons name="image" size={20} color="#6366f1" />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        // Position relative to screen for absolute placement of bubble
    },
    modalContent: {
        position: 'absolute',
        bottom: 90, // Approx height of input bar (50) + safe area (variable) + margin
        left: 20, // Approx margin of + button
        backgroundColor: '#1A1625',
        borderRadius: 24,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    option: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
