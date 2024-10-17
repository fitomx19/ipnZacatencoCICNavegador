import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { places } from '../data/places';

const PlacesScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.placeItem}>
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeCoordinates}>
        Lat: {item.coordinate.latitude}, Lon: {item.coordinate.longitude}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lugares</Text>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeCoordinates: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlacesScreen;