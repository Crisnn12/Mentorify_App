import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HomeScreen } from './screens/HomeScreen.js';
import { SearchScreen } from './screens/SearchScreen.js'; 
import { FollowsScreen } from './screens/FollowsScreen.js'; 
import { ProfileScreen } from './screens/ProfileScreen.js'; 
import { StreamScreen } from './screens/StreamScreen.js';
import { TutorProfileScreen } from './screens/TutorProfileScreen.js';
import LoginScreen from './screens/LoginScreen.js'; 
import { RegisterScreen } from './screens/RegisterScreen.js';
import ChatScreen from './screens/ChatScreen.js'; 

const Tab = createBottomTabNavigator(); 
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="TutorProfile" component={TutorProfileScreen} options={{ title: 'Perfil del Tutor' }} />
            <HomeStack.Screen name="Stream" component={StreamScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="ChatScreen" component={ChatScreen} options={({ route }) => ({ title: route.params.tutorName, presentation: 'modal' })} /> 
        </HomeStack.Navigator>
    );
}

function MainTabNavigator({ handleLogout }) {
    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
                headerShown: false, 
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'white', height: 60, paddingBottom: 5 },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Inicio') iconName = 'home';
                    else if (route.name === 'Buscar') iconName = 'magnify';
                    else if (route.name === 'Seguidos') iconName = 'heart-outline';
                    else if (route.name === 'Perfil') iconName = 'account';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeStackScreen} />
            <Tab.Screen name="Buscar" component={SearchScreen} />
            <Tab.Screen name="Seguidos" component={FollowsScreen} />
            <Tab.Screen name="Perfil">
                {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function AuthStackNavigator({ setIsAuthenticated }) {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} initialParams={{ setIsAuthenticated }} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) setIsAuthenticated(true);
            } catch (e) {
                console.error('Error token:', e);
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, []);

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'userProfilePic']);
            setIsAuthenticated(false); 
        } catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    };

    if (loading) {
        return (
            <View style={styles.splashContainer}>
                <Text style={styles.splashText}>MENTOR/FY</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <MainTabNavigator handleLogout={logout} />
            ) : (
                <AuthStackNavigator setIsAuthenticated={setIsAuthenticated} />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A59A7' },
    splashText: { color: 'white', fontSize: 24, fontWeight: 'bold' }
});
