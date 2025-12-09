import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_USER = { user: 'Tú', isVIP: true }; 
const SOCKET_URL = 'http://10.233.18.240:5000'; 

const INITIAL_MESSAGES = [
    { id: 'init-1', user: 'Moderador', content: '¡Bienvenidos a la clase de hoy! Recuerden ser respetuosos.', destacado: true },
    { id: 'init-2', user: 'Juan P.', content: '¿A qué hora empieza la parte práctica?' },
    { id: 'init-3', user: 'Lucía M.', content: '¡Hola profe! Lista para aprender.' },
];

const ChatBox = ({ claseId }) => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            path: '/socket.io', 
            transports: ['websocket'] 
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('joinClass', claseId);
        });

        socketRef.current.on('receiveMessage', (message) => {
            setMessages(prevMessages => [
                { 
                    id: Date.now().toString() + Math.random(), 
                    ...message,
                    destacado: message.isVIP || false 
                }, 
                ...prevMessages
            ]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [claseId]);

    const handleSend = () => {
        if (newMessage.trim() && socketRef.current && socketRef.current.connected) {
            const messageData = {
                claseId,
                user: MOCK_USER.user,
                content: newMessage.trim(),
                isVIP: MOCK_USER.isVIP 
            };
            socketRef.current.emit('sendMessage', messageData);
            setNewMessage('');
        } else {
             if (newMessage.trim()) {
                 const localMsg = { 
                     id: Date.now().toString(), 
                     user: MOCK_USER.user, 
                     content: newMessage.trim(), 
                     isVIP: MOCK_USER.isVIP 
                 };
                 setMessages(prev => [localMsg, ...prev]);
                 setNewMessage('');
             }
        }
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.message, item.destacado && styles.highlightedMessage]}>
            <Text style={styles.user}>{item.user}:</Text>
            <Text style={styles.content}>{item.content}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                style={styles.messagesList}
                inverted 
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Escribe tu pregunta..."
                    placeholderTextColor="#999"
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!newMessage.trim()}>
                    <MaterialCommunityIcons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    messagesList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    message: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        alignItems: 'flex-start', 
    },
    highlightedMessage: {
        backgroundColor: '#FFFBE6', 
        paddingHorizontal: 8,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#FFD700',
        marginBottom: 4,
    },
    user: {
        fontWeight: 'bold',
        color: '#007AFF',
        marginRight: 6,
        fontSize: 14,
        marginTop: 2, 
    },
    content: {
        flex: 1,
        flexShrink: 1, 
        color: '#333',
        fontSize: 14,
        lineHeight: 20,
    },
    inputArea: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        backgroundColor: 'white',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        minHeight: 40,
        backgroundColor: '#EFEFEF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10, 
        paddingBottom: 10, 
        marginRight: 10,
        fontSize: 16,
        textAlignVertical: 'center', 
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2, 
    }
});

export default ChatBox;