import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchPlaces } from '../api';
import { MaterialIcons } from '@expo/vector-icons';

const PlacesScreen = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const fetchedPlaces = await fetchPlaces();
      setPlaces(fetchedPlaces);
    } catch (err) {
      setError('Error al cargar los lugares. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const groupPlacesByCategory = () => {
    return places.reduce((acc, place) => {
      if (!acc[place.category]) {
        acc[place.category] = [];
      }
      acc[place.category].push(place);
      return acc;
    }, {});
  };

  const renderPlace = ({ item }) => (
    <View style={styles.placeItem}>
      <View style={styles.placeHeader}>
        <MaterialIcons name="place" size={24} color="#007AFF" />
        <Text style={styles.placeName}>{item.name}</Text>
      </View>
      <Text style={styles.placeDescription}>{item.description || 'No hay descripción disponible.'}</Text>
      <Text style={styles.placeCoordinates}>
        Lat: {item.latitude.toFixed(6)}, Lon: {item.longitude.toFixed(6)}
      </Text>
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.data}
        renderItem={renderPlace}
        keyExtractor={(place) => place._id.toString()}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlaces}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groupedPlaces = groupPlacesByCategory();
  const categoriesData = Object.entries(groupedPlaces).map(([category, data]) => ({
    category,
    data,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lugares de Interés</Text>
      <FlatList
        data={categoriesData}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  placeItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  placeCoordinates: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default PlacesScreen;