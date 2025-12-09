import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'; 
import ChatBox from '../components/ChatBox.js';
import axios from 'axios';

const windowHeight = Dimensions.get('window').height;
const API_URL = 'http://10.233.18.240:5000/api/classes'; 

const SAMPLE_VIDEOS = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

export const StreamScreen = ({ navigation, route }) => {
    const { claseId, title } = route.params || { claseId: 'clase-demo-1', title: 'Clase de Álgebra Lineal' };
    
    const videoRef = useRef(null);
    const [tutorInfo, setTutorInfo] = useState(null);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/${claseId}`);
                if (response.data && response.data.tutor) {
                    setTutorInfo(response.data.tutor);
                }
            } catch (error) {
                console.log("No se pudo cargar info del tutor", error);
            }
        };
        fetchClassDetails();
    }, [claseId]);

    const getVideoSource = (id) => {
        if (!id) return SAMPLE_VIDEOS[0];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % SAMPLE_VIDEOS.length;
        return SAMPLE_VIDEOS[index];
    };

    const activeVideoSource = getVideoSource(claseId);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <View style={styles.videoPlayerContainer}>
                    <Video
                        ref={videoRef}
                        style={styles.video}
                        source={{ uri: activeVideoSource }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN} 
                        isLooping
                        shouldPlay={true} 
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>🔴 EN VIVO</Text>
                    </View>
                </View>

                <View style={styles.tutorInfoBar}>
                    {tutorInfo ? (
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('TutorProfile', { tutorId: tutorInfo._id, tutorName: tutorInfo.nombre })}>
                                <Image 
                                    source={{ uri: tutorInfo.foto_perfil || 'https://placehold.co/100x100/png' }} 
                                    style={styles.tutorAvatar} 
                                />
                            </TouchableOpacity>
                            <View style={styles.tutorTextContainer}>
                                <Text style={styles.classTitle} numberOfLines={1}>{title}</Text>
                                <Text style={styles.tutorName}>{tutorInfo.nombre}</Text>
                                <Text style={styles.tutorSpecialty}>{tutorInfo.especialidad}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.profileButton}
                                onPress={() => navigation.navigate('TutorProfile', { tutorId: tutorInfo._id, tutorName: tutorInfo.nombre })}
                            >
                                <Text style={styles.profileButtonText}>Ver Perfil</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <ActivityIndicator color="#007AFF" />
                    )}
                </View>

                <View style={styles.detailsContainer}>
                    <ChatBox claseId={claseId} /> 
                </View> 
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
    },
    videoPlayerContainer: {
        width: '100%',
        height: windowHeight * 0.30, 
        backgroundColor: 'black',
        justifyContent: 'center', 
    },
    video: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 5,
    },
    liveBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 59, 48, 0.9)', 
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        zIndex: 10,
    },
    liveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tutorInfoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 80,
    },
    tutorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 10,
    },
    tutorTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    classTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    tutorName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#007AFF',
    },
    tutorSpecialty: {
        fontSize: 11,
        color: '#666',
    },
    profileButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#E6F0FF',
        borderRadius: 15,
    },
    profileButtonText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
});