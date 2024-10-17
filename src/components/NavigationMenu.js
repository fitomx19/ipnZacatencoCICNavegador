// NavigationMenu.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationMenu = ({ destinations, onDestinationSelect, onStartNavigation, onToggleTravelMode, travelMode, destination, onClose }) => {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.travelModeContainer}>
        <TouchableOpacity 
          style={[styles.travelModeButton, travelMode === 'DRIVING' && styles.activeTravelMode]} 
          onPress={() => onToggleTravelMode('DRIVING')}
        >
          <MaterialIcons name="directions-car" size={24} color={travelMode === 'DRIVING' ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.travelModeButton, travelMode === 'WALKING' && styles.activeTravelMode]} 
          onPress={() => onToggleTravelMode('WALKING')}
        >
          <MaterialIcons name="directions-walk" size={24} color={travelMode === 'WALKING' ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.travelModeButton, travelMode === 'BICYCLING' && styles.activeTravelMode]} 
          onPress={() => onToggleTravelMode('BICYCLING')}
        >
          <MaterialIcons name="directions-bike" size={24} color={travelMode === 'BICYCLING' ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.destinationList}>
        {destinations.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.destinationButton}
            onPress={() => onDestinationSelect(dest)}
          >
            <Text style={styles.destinationButtonText}>{dest.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.startButton, !destination && styles.startButtonDisabled]}
        onPress={onStartNavigation}
        disabled={!destination}
      >
        <Text style={styles.startButtonText}>Iniciar Navegación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  travelModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  travelModeButton: {
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  activeTravelMode: {
    backgroundColor: '#007AFF',
  },
  destinationList: {
    maxHeight: 200,
  },
  destinationButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  destinationButtonText: {
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  startButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  startButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NavigationMenu;