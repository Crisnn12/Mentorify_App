import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ClaseCard = ({ clase, navigation, type = 'default' }) => {
    
    const imageSource = { uri: 'https://picsum.photos/400/240?random=' + clase.id }; 

    const handleClassPress = () => {
        navigation.navigate('Stream', { claseId: clase.id, title: clase.titulo });
    };

    const handleTutorPress = () => {
        navigation.navigate('TutorProfile', { 
            tutorId: clase.tutorId, 
            tutorName: clase.tutorNombre 
        }); 
    };

    const isGridItem = type === 'default'; 

    return (
        <TouchableOpacity 
            style={[styles.card, !isGridItem && { width: '100%' }]} 
            onPress={handleClassPress}
        >
            {type === 'live' && (
                <View style={styles.liveTag}>
                    <Text style={styles.liveText}>🔴 {clase.viewers} En Vivo</Text> 
                </View>
            )}
            
            <Image 
                source={imageSource} 
                style={styles.thumbnail} 
            />
            
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{clase.titulo}</Text>
                
                <TouchableOpacity onPress={handleTutorPress}>
                    <Text style={styles.tutor}>Tutor: {clase.tutorNombre}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12, 
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, 
    },
    thumbnail: {
        width: '100%',
        height: 120, 
        backgroundColor: '#eee',
    },
    liveTag: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255, 0, 0, 0.8)', 
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 10,
    },
    liveText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    infoContainer: {
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 8,
    },
    tutor: {
        fontSize: 12,
        color: '#007AFF', 
        marginTop: 4,
    },
});

export default ClaseCard;