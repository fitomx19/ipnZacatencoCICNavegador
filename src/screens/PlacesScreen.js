// src/screens/PlacesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlacesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lugares</Text>
      <Text>Aquí puedes agregar una lista de lugares favoritos o recientes.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PlacesScreen;