// NavigationMenu.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationMenu = ({ escuelas, onSchoolSelect, onStartNavigation, onToggleTravelMode, travelMode, destination }) => {
  return (
    <View style={styles.menuContainer}>
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
      </View>
      {escuelas.map((escuela) => (
        <TouchableOpacity
          key={escuela.id}
          style={styles.schoolButton}
          onPress={() => onSchoolSelect(escuela)}
        >
          <Text style={styles.schoolButtonText}>{escuela.name}</Text>
        </TouchableOpacity>
      ))}
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
  schoolButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  schoolButtonText: {
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