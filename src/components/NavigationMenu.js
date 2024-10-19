// components/NavigationMenu.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationMenu = ({
  destinations,
  onDestinationSelect,
  onStartNavigation,
  onToggleTravelMode,
  travelMode,
  destination,
  onClose,
  selectedDestinationId,
  userLocation,
  onOriginSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOriginId, setSelectedOriginId] = useState(null);

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOriginSelect = (origin) => {
    setSelectedOriginId(origin.id);
    onOriginSelect(origin);
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar destino..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.sectionTitle}>Origen</Text>
      <ScrollView style={styles.originList}>
        <TouchableOpacity
          style={[styles.originButton, selectedOriginId === 'current' && styles.selectedOrigin]}
          onPress={() => handleOriginSelect({ id: 'current', coordinate: userLocation })}
        >
          <Text style={styles.originButtonText}>Mi ubicación actual</Text>
          {selectedOriginId === 'current' && (
            <MaterialIcons name="check" size={24} color="green" />
          )}
        </TouchableOpacity>
        {destinations.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={[styles.originButton, selectedOriginId === dest.id && styles.selectedOrigin]}
            onPress={() => handleOriginSelect(dest)}
          >
            <Text style={styles.originButtonText}>{dest.name}</Text>
            {selectedOriginId === dest.id && (
              <MaterialIcons name="check" size={24} color="green" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Destino</Text>
      <ScrollView style={styles.destinationList}>
        {filteredDestinations.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={[styles.destinationButton, selectedDestinationId === dest.id && styles.selectedDestination]}
            onPress={() => onDestinationSelect(dest)}
          >
            <Text style={styles.destinationButtonText}>{dest.name}</Text>
            {selectedDestinationId === dest.id && (
              <MaterialIcons name="check" size={24} color="green" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

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

      <TouchableOpacity
        style={[styles.startButton, (!destination || !selectedOriginId) && styles.startButtonDisabled]}
        onPress={onStartNavigation}
        disabled={!destination || !selectedOriginId}
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
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  originList: {
    maxHeight: 100,
  },
  originButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOrigin: {
    backgroundColor: '#e0e0e0',
  },
  originButtonText: {
    flex: 1,
  },
  destinationList: {
    maxHeight: 150,
  },
  destinationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedDestination: {
    backgroundColor: '#e0e0e0',
  },
  destinationButtonText: {
    flex: 1,
  },
  travelModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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