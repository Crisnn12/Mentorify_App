import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, TextInput, Image, ActivityIndicator, Alert, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import ClaseCard from '../components/ClaseCard.js'; 

const windowWidth = Dimensions.get('window').width;

const API_CLASES_URL = 'http://10.233.18.240:5000/api/classes'; 
const API_TUTORES_URL = 'http://10.233.18.240:5000/api/user/tutores'; 
const quickFilters = [
    { label: 'Ramo', icon: 'book', type: 'ramo' },
    { label: 'Tutor', icon: 'account', type: 'tutor' },
    { label: 'Clase', icon: 'monitor', type: 'clase' },
];

const FilterButton = ({ label, icon, type, active, onPress }) => (
    <TouchableOpacity 
        style={[styles.filterPill, active && styles.filterPillActive]}
        onPress={() => onPress(type)}
    >
        <MaterialCommunityIcons 
            name={icon} 
            size={18} 
            color={active ? 'white' : '#007AFF'} 
            style={styles.filterPillIcon} 
        />
        <Text style={[styles.filterPillLabel, active && styles.filterPillLabelActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const TutorProfileCard = ({ tutor, navigation }) => (
    <TouchableOpacity 
        style={styles.tutorProfileCard}
        onPress={() => navigation.navigate('TutorProfile', { tutorId: tutor._id, tutorName: tutor.nombre })}
    >
        <Image 
            source={{ uri: tutor.foto_perfil || `https://placehold.co/100x100/5C6BC0/FFFFFF?text=${tutor.nombre.charAt(0)}` }} 
            style={styles.tutorProfileImage} 
        />
        <View style={styles.onlineDot} /> 
        <Text style={styles.tutorName} numberOfLines={1}>{tutor.nombre}</Text>
        <Text style={styles.tutorRole} numberOfLines={1}>{tutor.especialidad}</Text>
    </TouchableOpacity>
);

const TutorView = ({ navigation, searchText }) => {
    const [tutores, setTutores] = useState([]);
    const [clasesPopulares, setClasesPopulares] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const searchParam = searchText ? `?search=${encodeURIComponent(searchText)}` : '';
                const tutoresRes = await axios.get(API_TUTORES_URL + searchParam);
                setTutores(tutoresRes.data);
                const clasesRes = await axios.get(`${API_CLASES_URL}${searchParam}`);
                setClasesPopulares(clasesRes.data);

            } catch (error) {
                console.error('Error al cargar datos:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchText]); 

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />;

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {searchText ? `Mentores encontrados` : 'Nuestros Mentores'}
                </Text>
            </View>

            {tutores.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tutorScrollContainer}>
                    {tutores.map(tutor => (
                        <TutorProfileCard key={tutor._id} tutor={tutor} navigation={navigation} /> 
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.noResultsText}>No se encontraron tutores.</Text>
            )}
            
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Clases Destacadas</Text>
            </View>

            {clasesPopulares.length > 0 ? (
                clasesPopulares.map((clase) => (
                    <View key={clase._id} style={{ marginBottom: 15 }}>
                         <ClaseCard 
                            clase={{
                                id: clase._id,
                                titulo: clase.titulo,
                                tutorNombre: clase.tutor ? clase.tutor.nombre : 'Tutor',
                                tutorId: clase.tutor ? clase.tutor._id : null,
                                url_portada: clase.url_portada,
                                viewers: clase.vistas
                            }} 
                            navigation={navigation} 
                            type="default" 
                        />
                    </View>
                ))
            ) : (
                <Text style={styles.noResultsText}>No hay clases disponibles.</Text>
            )}
        </ScrollView>
    );
};

const ClaseView = ({ searchText, navigation }) => {
    const [clases, setClases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClases = async () => {
            setLoading(true);
            try {
                const url = searchText 
                    ? `${API_CLASES_URL}?search=${encodeURIComponent(searchText)}`
                    : API_CLASES_URL;
                
                const response = await axios.get(url);
                setClases(response.data);
            } catch (error) {
                console.error('Error buscando clases:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClases();
    }, [searchText]);

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />;

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.resultsHeader}>
                {searchText ? `Resultados: ${clases.length}` : 'Todas las Clases'}
            </Text>
            
            {clases.length > 0 ? (
                clases.map((clase) => (
                    <View key={clase._id} style={{ marginBottom: 15 }}>
                         <ClaseCard 
                            clase={{
                                id: clase._id,
                                titulo: clase.titulo,
                                tutorNombre: clase.tutor ? clase.tutor.nombre : 'Tutor',
                                tutorId: clase.tutor ? clase.tutor._id : null,
                                url_portada: clase.url_portada,
                                viewers: clase.vistas
                            }} 
                            navigation={navigation} 
                            type="default" 
                        />
                    </View>
                ))
            ) : (
                <Text style={styles.noResultsText}>No se encontraron clases.</Text>
            )}
        </ScrollView>
    );
};

const RamoView = ({ onCategorySelect }) => {
    const categoryTiles = [
        { name: 'Programación', icon: 'code-tags', color: '#3B5998' },
        { name: 'Matemáticas', icon: 'sigma', color: '#6A5ACD' },
        { name: 'Historia', icon: 'timer-sand', color: '#B22222' },
        { name: 'Economía', icon: 'finance', color: '#FFD700' },
        { name: 'Química', icon: 'test-tube', color: '#1E90FF' },
        { name: 'Lenguaje', icon: 'book-open-variant', color: '#FF7F50' },
    ];

    return (
        <View style={styles.tilesContainer}>
            {categoryTiles.map((category, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.categoryTile, { backgroundColor: category.color }]}
                    onPress={() => onCategorySelect(category.name)}
                >
                    <MaterialCommunityIcons name={category.icon} size={60} color="white" />
                    <Text style={styles.categoryTileText}>{category.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export const SearchScreen = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('ramo');

    useEffect(() => {
        if (route.params?.search) {
            setSearchText(route.params.search);
            setActiveFilter('clase'); 
        }
    }, [route.params]);

    const handleCategorySelect = (categoryName) => {
        setSearchText(categoryName);
        setActiveFilter('clase');
    };

    const renderContent = () => {
        if (activeFilter === 'tutor') {
            return <TutorView navigation={navigation} searchText={searchText} />;
        }
        if (activeFilter === 'clase') {
            return <ClaseView navigation={navigation} searchText={searchText} />;
        }
        return <RamoView onCategorySelect={handleCategorySelect} />;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchHeader}>
                    <TextInput
                        style={styles.input}
                        placeholder={activeFilter === 'tutor' ? "Buscar tutor..." : "Buscar clase o materia..."}
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            if (text.length > 0 && activeFilter === 'ramo') {
                                setActiveFilter('clase');
                            }
                        }}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                            <MaterialCommunityIcons name="close-circle" size={24} color="#666" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.filterIcon} onPress={() => Alert.alert('Filtros', 'Filtros avanzados próximamente')}>
                        <MaterialCommunityIcons name="tune" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.quickFiltersContainer}>
                    {quickFilters.map(filter => (
                        <FilterButton
                            key={filter.type}
                            label={filter.label}
                            icon={filter.icon}
                            type={filter.type}
                            active={filter.type === activeFilter}
                            onPress={(type) => {
                                setActiveFilter(type);
                            }}
                        />
                    ))}
                </View>

                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F0F0' },
    container: { flex: 1, paddingHorizontal: 15, paddingTop: 48 },
    searchHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, height: 50, borderWidth: 1, borderColor: '#E0E0E0' },
    input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
    clearButton: { padding: 5 },
    filterIcon: { marginLeft: 10, padding: 5, backgroundColor: '#E6F0FF', borderRadius: 8 },
    quickFiltersContainer: { flexDirection: 'row', marginBottom: 20 },
    filterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F0FF', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
    filterPillActive: { backgroundColor: '#007AFF' },
    filterPillIcon: { marginRight: 5 },
    filterPillLabel: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
    filterPillLabelActive: { color: 'white' },
    
    tilesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryTile: { width: (windowWidth - 45) / 2, height: (windowWidth - 45) / 3, borderRadius: 15, marginBottom: 15, padding: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    categoryTileText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginTop: 10 },
    
    sectionHeader: { marginBottom: 10, marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    tutorScrollContainer: { paddingBottom: 20, paddingRight: 15 },
    tutorProfileCard: { alignItems: 'center', marginRight: 15, width: 85 },
    tutorProfileImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#007AFF', marginBottom: 5 },
    onlineDot: { position: 'absolute', bottom: 25, right: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: '#34C759', borderWidth: 2, borderColor: 'white' },
    tutorName: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
    tutorRole: { fontSize: 10, color: '#666', textAlign: 'center' },
    
    resultsHeader: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 10 },
    noResultsText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40 },
});