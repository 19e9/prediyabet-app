import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BmiScreen from '../screens/BmiScreen';
import PedometerScreen from '../screens/PedometerScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import FindriskScreen from '../screens/FindriskScreen';
import TestScreen from '../screens/TestScreen';
import HealthInfoScreen from '../screens/HealthInfoScreen';
import FaqScreen from '../screens/FaqScreen';
import ContactScreen from '../screens/ContactScreen';
import AboutScreen from '../screens/AboutScreen';
import WeeklyStepsScreen from '../screens/WeeklyStepsScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Bmi" component={BmiScreen} />
            <Stack.Screen name="Pedometer" component={PedometerScreen} />
            <Stack.Screen name="FoodTracking" component={FoodTrackingScreen} />
            <Stack.Screen name="Findrisk" component={FindriskScreen} />
            <Stack.Screen name="PreTest" component={TestScreen} initialParams={{ type: 'pre' }} />
            <Stack.Screen name="PostTest" component={TestScreen} initialParams={{ type: 'post' }} />
            <Stack.Screen name="HealthInfo" component={HealthInfoScreen} />
            <Stack.Screen name="Faq" component={FaqScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="WeeklySteps" component={WeeklyStepsScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { user, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) return null;

    return (
        <NavigationContainer
            theme={{
                ...(theme.dark ? DarkTheme : DefaultTheme),
                dark: theme.dark,
                colors: {
                    ...(theme.dark ? DarkTheme : DefaultTheme).colors,
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.surface,
                    text: theme.colors.text,
                    border: theme.colors.border,
                    notification: theme.colors.primary,
                },
            }}
        >
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
