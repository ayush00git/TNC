import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Logic to tell TypeScript about our navigation (Optional but good practice)
// type Props = NativeStackScreenProps<any, 'Welcome'>;

export default function WelcomeScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.contentContainer}>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>T</Text>
                </View>

                <Text style={styles.title}>TNC</Text>

                {/* Hero Text */}
                <Text style={styles.headline}>
                    The Network for{'\n'}
                    <Text style={styles.highlight}>Creative Developers</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Real-time chat, domain-specific rooms, and a community that ships.
                </Text>

                {/* Buttons - Now with real Navigation */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.buttonText}>SignUp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.secondaryButtonText}>Log In</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060010',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#1e1b4b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
        letterSpacing: 2,
    },
    headline: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    highlight: {
        color: '#818cf8',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    button: {
        width: '100%',
        backgroundColor: '#4f46e5',
        paddingVertical: 18,
        borderRadius: 99,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: '#0A0514',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 18,
        borderRadius: 99,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#cbd5e1',
        fontSize: 16,
        fontWeight: '500',
    },
});