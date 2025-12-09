import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_URL = 'http://10.233.18.240:5000/api/user'; 

export const RegisterScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('Estudiante'); 
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nombre || !correo || !contrasena) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, {
                nombre,
                correo,
                contrasena,
                rol, 
            });

            Alert.alert(
                'Registro Exitoso', 
                response.data.message || 'Usuario registrado. Ahora inicia sesión.'
            );

            navigation.navigate('Login'); 

        } catch (error) {
            console.error('Error de Registro:', error.response ? error.response.data : error.message);
            Alert.alert(
                'Error de Registro', 
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
                        placeholder="Nombre completo"
                        value={nombre}
                        onChangeText={setNombre}
                        autoCapitalize="words"
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

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="email" size={20} color="#5C6BC0" style={styles.inputIcon} />
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
                
                <View style={styles.roleSelector}>
                    <Text style={styles.roleLabel}>Quiero registrarme como:</Text>
                    <TouchableOpacity 
                        style={[styles.roleButton, rol === 'Estudiante' && styles.roleButtonActive]}
                        onPress={() => setRol('Estudiante')}
                    >
                        <Text style={[styles.roleText, rol === 'Estudiante' && styles.roleTextActive]}>Estudiante</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.roleButton, rol === 'Tutor' && styles.roleButtonActive]}
                        onPress={() => setRol('Tutor')}
                    >
                        <Text style={[styles.roleText, rol === 'Tutor' && styles.roleTextActive]}>Tutor</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
                </TouchableOpacity>

            </View>
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
    roleSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 15,
        flexWrap: 'wrap', 
    },
    roleLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 10,
        marginBottom: 5,
    },
    roleButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#5C6BC0',
        marginHorizontal: 5,
        marginBottom: 5, 
    },
    roleButtonActive: {
        backgroundColor: '#5C6BC0',
    },
    roleText: {
        fontSize: 14,
        color: '#5C6BC0',
        fontWeight: '600',
    },
    roleTextActive: {
        color: 'white',
    },
    button: {
        width: '100%',
        backgroundColor: '#5C6BC0', 
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});