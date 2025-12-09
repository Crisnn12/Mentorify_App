import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://10.233.18.240:5000';

const MOCK_MESSAGES = [];

const ChatScreen = ({ route, navigation }) => {
    const { tutorId, tutorName } = route.params;
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [userId, setUserId] = useState(null);
    const socket = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const initializeChat = async () => {
            const userDataString = await AsyncStorage.getItem('userData');
            const token = await AsyncStorage.getItem('userToken');
            
            if (!userDataString || !token) {
                Alert.alert('Error', 'No se pudo cargar la sesión de usuario. Por favor, reinicia la app.');
                return;
            }

            const user = JSON.parse(userDataString);
            setUserId(user.id); 
            
            socket.current = io(SOCKET_URL, {
                query: { token }, 
                path: '/socket.io', 
                transports: ['websocket'],
            });

            socket.current.on('message', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            socket.current.on('connect', () => {
                console.log('Socket conectado con éxito.');
                socket.current.emit('joinRoom', { tutorId, studentId: user.id });
            });
            
            socket.current.on('connect_error', (err) => {
                console.error('Socket error:', err.message);
            });


            return () => {
                socket.current.disconnect();
            };
        };
        initializeChat();
    }, [tutorId]);
    
    const scrollToBottom = () => {
         if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim() === '') return;
        if (!socket.current || !socket.current.connected) {
            Alert.alert('Error', 'El chat no está conectado. Intenta reiniciar la app.');
            return;
        }

        const newMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            senderId: userId, 
            tutorId: tutorId,
            timestamp: new Date().toISOString(),
        };

        socket.current.emit('sendMessage', newMessage);

        setMessages(prevMessages => [...prevMessages, { ...newMessage, user: 'student' }]);
        setInputText('');
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.senderId === userId; 

        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat con {tutorName}</Text>
            </View>
            
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                onLayout={() => scrollToBottom()}
            />

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Escribe un mensaje..."
                    value={inputText}
                    onChangeText={setInputText}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={inputText.trim() === ''}>
                    <MaterialCommunityIcons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: Platform.OS === 'android' ? 40 : 15, 
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    messageList: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 15,
        elevation: 1,
    },
    myMessageContainer: {
        backgroundColor: '#4A59A7',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
    },
    otherMessageContainer: {
        backgroundColor: '#E0E0E0',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
    },
    myMessageText: {
        color: 'white',
        fontSize: 16,
    },
    otherMessageText: {
        color: '#333',
        fontSize: 16,
    },
    inputArea: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F4F7FC',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#4A59A7',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;