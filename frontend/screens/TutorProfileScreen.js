import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;

const API_BASE_URL = 'http://10.233.18.240:5000/api/user'; 

const ReviewCard = ({ name, rating, comment }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <Text style={styles.reviewName}>{name}</Text>
            <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{rating}</Text>
            </View>
        </View>
        <Text style={styles.reviewComment}>{comment}</Text>
    </View>
);

export const TutorProfileScreen = ({ route, navigation }) => {
    const { tutorId } = route.params; 
    
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [token, setToken] = useState(null);
    const [isSubscriber, setIsSubscriber] = useState(false); 

    useEffect(() => {
        const loadToken = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            setToken(userToken);
            if (userToken) setIsSubscriber(true);
        };
        loadToken();
    }, []);

    useEffect(() => {
        const fetchTutorProfile = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '', 
                    },
                };
                const response = await axios.get(`${API_BASE_URL}/tutor/${tutorId}`, config);
                
                setTutorData(response.data);
                setIsFollowing(response.data.isFollowing); 
            } catch (error) {
                console.error('Error al cargar perfil:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (tutorId) fetchTutorProfile();
    }, [tutorId, token]);

    const handleToggleFollow = async () => {
        const currentToken = await AsyncStorage.getItem('userToken');
        if (!currentToken) {
            Alert.alert('Inicia Sesión', 'Debes iniciar sesión para seguir.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${currentToken}` } };
            const response = await axios.post(`${API_BASE_URL}/follow/${tutorId}`, {}, config);
            setIsFollowing(response.data.isFollowing);
            Alert.alert('Éxito', response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await AsyncStorage.removeItem('userToken');
                setToken(null); 
                navigation.navigate('Login'); 
            } else {
                 Alert.alert('Error', 'No se pudo actualizar el seguimiento.');
            }
        }
    };
    
    const handleChat = async () => {
        const currentToken = await AsyncStorage.getItem('userToken');
        if (!currentToken) {
             Alert.alert('Acceso Denegado', 'Inicia sesión para chatear.');
             return;
        }
        navigation.navigate('ChatScreen', { 
            tutorId: tutorData._id, 
            tutorName: tutorData.nombre 
        });
    };

    const handleReserveClass = (clase) => {
        if (!token) {
            Alert.alert('Acceso Denegado', 'Inicia sesión para reservar.');
            return;
        }
        Alert.alert('Confirmar Reserva', `Reservar ${clase.tipo} con ${tutorData.nombre}?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Confirmar', onPress: () => Alert.alert('Éxito', 'Reserva enviada.') }
        ]);
    };

    if (loading || !tutorData) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
    }

    const { nombre, especialidad, biografia, rating_promedio, foto_perfil } = tutorData; 
    const rating = rating_promedio ? rating_promedio.toFixed(1) : '5.0';
    
    const imageSource = (foto_perfil && foto_perfil.startsWith('http')) 
        ? { uri: foto_perfil } 
        : { uri: `https://placehold.co/150x150/5C6BC0/FFFFFF?text=${nombre ? nombre.charAt(0) : 'T'}` };

    const tarifasMock = [
        { tipo: 'Clase Individual', precio: 25, unidad: 'hora' },
        { tipo: 'Paquete de 5 sesiones', precio: 100, unidad: 'paquete' },
    ];
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.profileHeader}>
                    <Image 
                        source={imageSource} 
                        style={styles.profileImage} 
                    />
                    
                    <Text style={styles.tutorName}>{nombre}</Text>
                    <Text style={styles.tutorSpecialty}>{especialidad}</Text> 
                    
                    <View style={styles.actionButtonsRow}>
                         <TouchableOpacity style={styles.actionButtonSecondary} onPress={handleChat}>
                            <MaterialCommunityIcons name="chat" size={20} color="#007AFF" />
                            <Text style={styles.actionButtonTextSecondary}>Mensaje</Text>
                        </TouchableOpacity>

                         <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => handleReserveClass(tarifasMock[0])}>
                            <MaterialCommunityIcons name="video-outline" size={20} color="white" />
                            <Text style={styles.actionButtonText}>Clase</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButtonSubscription} onPress={() => Alert.alert("Info", "Suscripción Premium")}>
                            <MaterialCommunityIcons name={isSubscriber ? "crown" : "crown-outline"} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButtonActive]}
                        onPress={handleToggleFollow}
                    >
                        <MaterialCommunityIcons name={isFollowing ? "check" : "plus"} size={20} color="white" style={{marginRight: 5}} />
                        <Text style={styles.followButtonText}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
                    </TouchableOpacity>

                    <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={22} color="#FFC107" />
                        <Text style={styles.ratingText}>{rating}</Text>
                        <Text style={styles.ratingCount}>(0 Reviews)</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Biografía</Text>
                    <Text style={styles.biographyText}>
                        {biografia || "Este tutor aún no ha añadido una biografía."}
                    </Text>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tarifas</Text>
                    {tarifasMock.map((tarifa, index) => (
                         <View style={styles.rateItem} key={index}>
                            <MaterialCommunityIcons 
                                name={tarifa.tipo.includes('Paquete') ? 'package-variant-closed' : 'clock-outline'} 
                                size={20} 
                                color="#007AFF" 
                            />
                            <Text style={styles.rateText}>
                                {tarifa.tipo}: <Text style={{fontWeight: 'bold'}}>€{tarifa.precio}</Text>/{tarifa.unidad}
                            </Text>
                         </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reseñas Recientes</Text>
                    <ReviewCard name="Grace Hopper" rating={5.0} comment="Explicaciones muy claras." />
                    <ReviewCard name="Linus Torvalds" rating={4.5} comment="Muy buen tutor." />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F0F0' },
    scrollContainer: { paddingBottom: 40 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backButton: { padding: 10, alignSelf: 'flex-start', marginBottom: 5 },
    
    profileHeader: { 
        alignItems: 'center', 
        paddingVertical: 25, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        marginBottom: 20, 
        marginHorizontal: 15, 
        elevation: 4,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, 
        shadowRadius: 5 
    },
    profileImage: { 
        width: 110, 
        height: 110, 
        borderRadius: 55, 
        borderWidth: 3, 
        borderColor: '#007AFF', 
        marginBottom: 10,
        backgroundColor: '#eee' 
    },
    tutorName: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        textAlign: 'center',
        marginHorizontal: 10 
    },
    tutorSpecialty: { 
        fontSize: 16, 
        color: '#666', 
        marginBottom: 15, 
        textAlign: 'center', 
        paddingHorizontal: 20, 
        lineHeight: 22 
    },
    
    actionButtonsRow: { flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 15 },
    actionButtonPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5C6BC0', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 5 },
    actionButtonSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6F0FF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 5 },
    actionButtonSubscription: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, backgroundColor: '#FFC107' },
    actionButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 14 },
    actionButtonTextSecondary: { color: '#007AFF', fontWeight: 'bold', marginLeft: 5, fontSize: 14 },
    
    followButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 25, marginBottom: 15, elevation: 2 },
    followButtonActive: { backgroundColor: '#007AFF' },
    unfollowButton: { backgroundColor: '#FF3B30' },
    followButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    
    ratingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    ratingText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 5 },
    ratingCount: { fontSize: 14, color: '#999', marginLeft: 5 },
    
    section: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, marginHorizontal: 15, elevation: 1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
    biographyText: { fontSize: 15, color: '#444', lineHeight: 22 },
    rateItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    rateText: { fontSize: 15, marginLeft: 10, color: '#444', flex: 1 },
    reviewCard: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#007AFF' },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    reviewName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    reviewComment: { fontSize: 13, color: '#555', lineHeight: 18 }
});