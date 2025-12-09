import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const PLACEHOLDER_IMAGE = 'https://placehold.co/120x120/4A59A7/FFFFFF?text=PF';

export const ProfileScreen = ({ navigation, onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState(PLACEHOLDER_IMAGE); 
    const [isSubscribed, setIsSubscribed] = useState(false);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const userDataString = await AsyncStorage.getItem('userData');
            const storedProfilePic = await AsyncStorage.getItem('userProfilePic'); 

            if (userToken && userDataString) {
                const user = JSON.parse(userDataString);
                setUserData(user);
                setIsSubscribed(true); // Mock
                setProfilePic(storedProfilePic || PLACEHOLDER_IMAGE); 
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error('Error datos usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadUserData);
        return unsubscribe;
    }, [navigation]);

    const handleImageChange = async () => {
        const newUrl = `https://picsum.photos/120?random=${Math.random()}`; 
        try {
            await AsyncStorage.setItem('userProfilePic', newUrl); 
            setProfilePic(newUrl);
            Alert.alert('Éxito', 'Foto actualizada.');
        } catch (e) { Alert.alert('Error', 'Fallo al guardar foto.'); }
    };

    const performLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'userProfilePic']);
            setUserData(null); 

            if (onLogout && typeof onLogout === 'function') {
                onLogout();
            } else {
                Alert.alert(
                    "Sesión Cerrada Localmente", 
                    "Por favor, cierra y abre la aplicación para volver al Login."
                );
            }
        } catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    };

    const handleLogoutPress = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Cerrar Sesión', 
                    style: 'destructive',
                    onPress: performLogout
                },
            ]
        );
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#4A59A7" /></View>;
    }

    if (!userData) {
        return (
            <View style={styles.authPromptContainer}>
                <MaterialCommunityIcons name="lock-open-variant" size={60} color="#4A59A7" />
                <Text style={styles.authPromptTitle}>Sesión Finalizada</Text>
                <Text style={styles.authPromptText}>Has cerrado tu sesión correctamente.</Text>
                
                <TouchableOpacity style={styles.loginButton} onPress={performLogout}>
                    <Text style={styles.loginButtonText}>Ir al Inicio de Sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>

                <View style={styles.profileCard}>
                    <TouchableOpacity onPress={handleImageChange} style={styles.imageWrapper}>
                         <Image source={{ uri: profilePic }} style={styles.profileImage} />
                        <View style={styles.cameraIcon}>
                            <MaterialCommunityIcons name="camera" size={18} color="white" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.infoBlock}>
                        <Text style={styles.nameText}>{userData?.nombre}</Text>
                        <Text style={styles.emailText}>{userData?.correo}</Text>
                        <Text style={styles.roleText}>Rol: {userData?.rol}</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Detalles de la Cuenta</Text>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="account-details-outline" size={20} color="#5C6BC0" />
                        <Text style={[styles.detailText, {flex: 1}]}>Ver actividad</Text>
                    </View>
                    <View style={styles.detailRow}>
                         <MaterialCommunityIcons name="cog-outline" size={20} color="#5C6BC0" />
                        <Text style={[styles.detailText, {flex: 1}]}>Configuración</Text>
                    </View>
                </View>
                
                <View style={[styles.sectionCard, styles.subscribedCard]}>
                    <Text style={styles.sectionTitle}>Suscripción</Text>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="crown" size={24} color='#FFD700' />
                        <Text style={[styles.detailText, styles.subscribedText, {flex: 1}]}>Premium Activa</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F7FC' },
    container: { paddingHorizontal: 15, paddingTop: 40 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    profileCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    imageWrapper: { position: 'relative', marginRight: 15 },
    profileImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#E6E9F0' },
    cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4A59A7', borderRadius: 12, padding: 3, borderWidth: 2, borderColor: 'white' },
    infoBlock: { flex: 1 },
    nameText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    emailText: { fontSize: 14, color: '#666' },
    roleText: { fontSize: 14, color: '#4A59A7', fontWeight: '600', marginTop: 5 },
    sectionCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 8 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailText: { marginLeft: 10, fontSize: 16, color: '#555', flex: 1, paddingRight: 5 },
    subscribedCard: { borderLeftWidth: 5, borderLeftColor: '#34C759' },
    subscribedText: { color: '#34C759', fontWeight: 'bold' },
    logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    logoutButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    authPromptContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    authPromptTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A59A7', marginTop: 20, textAlign: 'center' },
    authPromptText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 30 },
    loginButton: { backgroundColor: '#5C6BC0', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
    loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});