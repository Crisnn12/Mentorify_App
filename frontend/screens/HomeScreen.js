import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import ClaseCard from '../components/ClaseCard'; 

const windowWidth = Dimensions.get('window').width;

const API_URL = 'http://10.233.18.240:5000/api/classes'; 

const categories = [
    { name: 'Programación', icon: 'code-tags', color: '#007AFF' },
    { name: 'Matemáticas', icon: 'calculator-variant', color: '#4CD964' },
    { name: 'Comunicación', icon: 'book-open-variant', color: '#FF9500' },
    { name: 'Historia', icon: 'castle', color: '#FF3B30' },
    { name: 'Economía', icon: 'finance', color: '#5C6BC0' },
    { name: 'Química', icon: 'test-tube', color: '#1E90FF' },
];

export const HomeScreen = ({ navigation }) => {
    const [liveClasses, setLiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLiveClasses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            const recentResponse = await axios.get(API_URL);
            
            const adaptedData = recentResponse.data.map((clase, index) => ({
                ...clase,
                tutorNombre: clase.tutor ? clase.tutor.nombre : 'Tutor Desconocido',
                viewers: clase.es_vivo ? 500 + (index * 10) : 0, 
                id: clase._id 
            }));

            setLiveClasses(adaptedData);

        } catch (error) {
            console.error('Error al obtener clases:', error.message);
            Alert.alert('Error', 'No se pudieron cargar las clases.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCategoryPress = (categoryName) => {
        navigation.navigate('Buscar', { 
            filter: 'clase', 
            search: categoryName 
        });
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.categoryTile, { backgroundColor: item.color }]}
            onPress={() => handleCategoryPress(item.name)} 
        >
            <MaterialCommunityIcons name={item.icon} size={40} color="white" />
            <Text style={styles.categoryTileText}>{item.name}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }
    
    const liveStreams = liveClasses.filter(c => c.es_vivo);
    const recentAndRecommended = liveClasses.filter(c => !c.es_vivo);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                
                <Text style={styles.header}>Clases en Vivo Ahora ({liveStreams.length})</Text>
                
                <FlatList
                    data={liveStreams.slice(0, 4)} 
                    renderItem={({ item }) => <ClaseCard clase={item} navigation={navigation} type="live" />}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    numColumns={2} 
                    columnWrapperStyle={styles.liveListContainer}
                    scrollEnabled={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay clases en vivo en este momento.</Text>}
                />

                <Text style={styles.header}>Explorar por Categoría</Text>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item.name}
                    numColumns={3} 
                    scrollEnabled={false}
                    columnWrapperStyle={styles.categoryRow}
                />

                <Text style={styles.header}>Recientes y Recomendadas</Text>
                {recentAndRecommended.slice(0, 5).map((clase) => (
                    <View key={clase.id} style={styles.recentCardWrapper}>
                         <ClaseCard clase={clase} navigation={navigation} type="default" />
                    </View>
                ))}
                
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
        paddingHorizontal: 15,
        paddingTop: 35,
    },
    contentContainer: {
        paddingVertical: 15,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 5,
        marginBottom: 10,
        marginTop: 15,
        color: '#333',
    },
    liveListContainer: {
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5, 
    },
    recentCardWrapper: {
        marginBottom: 15, 
        paddingHorizontal: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
    },
    
    categoryRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    categoryTile: {
        width: (windowWidth - 75) / 3, 
        height: (windowWidth - 75) / 3, 
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 10,
    },
    categoryTileText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 5,
        textAlign: 'center',
    },
});