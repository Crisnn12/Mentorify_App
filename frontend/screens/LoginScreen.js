import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_URL = 'http://10.233.18.240:5000/api/user'; 

const LoginScreen = ({ navigation, route }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const setIsAuthenticated = route.params?.setIsAuthenticated;

    const handleLogin = async () => {
        if (!correo || !contrasena) {
            Alert.alert('Error', 'Por favor, ingresa correo y contraseña.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                correo,
                contrasena,
            });

            const { token, user } = response.data;
            
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            Alert.alert('Éxito', 'Inicio de sesión exitoso.');

            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            } else {
                navigation.navigate('Inicio'); 
            }

        } catch (error) {
            console.error('Error de Login:', error.response ? error.response.data : error.message);
            Alert.alert(
                'Error de Login', 
                error.response && error.response.data ? 
                error.response.data.message : 
                'Hubo un problema al conectar con el servidor.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
             <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="school" size={60} color="white" />
            </View>
            
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="account" size={20} color="#5C6BC0" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="lock" size={20} color="#5C6BC0" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Contraseña" 
                        secureTextEntry
                        value={contrasena}
                        onChangeText={setContrasena}
                        placeholderTextColor="#999"
                    />
                </View>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar sesión'}</Text>
                </TouchableOpacity>
                
                <Text style={styles.forgotPassword}>
                    ¿Olvidaste la contraseña?
                </Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>
                    Registrarse
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A59A7',
        padding: 20,
    },
    iconContainer: {
        backgroundColor: '#5C6BC0',
        borderRadius: 50,
        padding: 10,
        marginBottom: -30, 
        zIndex: 10,
        borderWidth: 5,
        borderColor: '#4A59A7',
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#E6F0FF',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
        paddingVertical: 0, 
    },
    button: {
        width: '100%',
        backgroundColor: '#5C6BC0', 
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#5C6BC0',
        fontSize: 14,
        marginTop: 15,
        width: '100%',       
        textAlign: 'center',
        paddingVertical: 5,  
    },
    link: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 30,
    },
});

export default LoginScreen;