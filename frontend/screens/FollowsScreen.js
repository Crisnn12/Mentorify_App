import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_FOLLOWS_URL = 'http://10.233.18.240:5000/api/user/follows'; 

const FollowedTutorCard = ({ tutor, navigation }) => (
    <TouchableOpacity 
        style={styles.tutorCard}
        onPress={() => navigation.navigate('TutorProfile', { tutorId: tutor._id, tutorName: tutor.nombre })}
    >
        <Image 
            source={{ uri: `https://placehold.co/70x70/5C6BC0/FFFFFF?text=${tutor.nombre.charAt(0)}` }} 
            style={styles.tutorImage} 
        />
        <View style={styles.tutorDetails}>
            <Text style={styles.tutorName}>{tutor.nombre}</Text>
            <Text style={styles.tutorSpecialty}>{tutor.especialidad}</Text>
            <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{tutor.rating_promedio.toFixed(1)}</Text>
            </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#C7C7CC" />
    </TouchableOpacity>
);


export const FollowsScreen = ({ navigation }) => {
    const [followedTutors, setFollowedTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const fetchFollowedTutors = async () => {
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        setIsLoggedIn(true);
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(API_FOLLOWS_URL, config);
            setFollowedTutors(response.data);
        } catch (error) {
            console.error('Error al cargar seguidos:', error.response?.data || error.message);
            Alert.alert('Error', 'Fallo al cargar tus tutores seguidos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchFollowedTutors);
        return unsubscribe;
    }, [navigation]);

    if (!isLoggedIn) {
        return (
            <View style={styles.authContainer}>
                <MaterialCommunityIcons name="account-lock-outline" size={80} color="#007AFF" />
                <Text style={styles.authPromptTitle}>Necesitas Iniciar Sesión</Text>
                <Text style={styles.authPromptText}>Inicia sesión para ver y gestionar a tus tutores favoritos.</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginButtonText}>Ir a Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Text style={styles.headerTitle}>Mis Tutores Seguidos</Text>
                
                {followedTutors.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="bookmark-multiple-outline" size={60} color="#C7C7CC" />
                        <Text style={styles.emptyText}>Aún no sigues a ningún tutor.</Text>
                        <Text style={styles.emptySubText}>Encuentra tutores en la pestaña "Buscar" y síguelos.</Text>
                    </View>
                ) : (
                    followedTutors.map(tutor => (
                        <FollowedTutorCard key={tutor._id} tutor={tutor} navigation={navigation} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    tutorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tutorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#EFEFEF',
    },
    tutorDetails: {
        flex: 1,
    },
    tutorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    tutorSpecialty: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#FFC107',
        marginLeft: 5,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
    },
    authPromptTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    authPromptText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});