// components/NavigationMenu.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Autocomplete = ({ data, value, onChange, placeholder, onSelect, includeCurrentLocation, onUseCurrentLocation }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (value) {
      const filtered = data.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [value, data]);

  return (
    <View style={styles.autocompleteContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
        />
        {includeCurrentLocation && (
          <TouchableOpacity onPress={onUseCurrentLocation} style={styles.locationIcon}>
            <MaterialIcons name="my-location" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      {filteredData.length > 0 && (
        <ScrollView style={styles.suggestionList} nestedScrollEnabled={true}>
          {filteredData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => onSelect(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const NavigationMenu = ({
  destinations,
  onDestinationSelect,
  onStartNavigation,
  onToggleTravelMode,
  travelMode,
  destination,
  onClose,
  userLocation,
  onOriginSelect
}) => {
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [origin, setOrigin] = useState(null);

  const handleOriginSelect = (selectedOrigin) => {
    setOriginValue(selectedOrigin.name);
    setOrigin(selectedOrigin);
    onOriginSelect(selectedOrigin);
  };

  const handleDestinationSelect = (dest) => {
    setDestinationValue(dest.name);
    onDestinationSelect(dest);
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      const currentLocationOrigin = {
        id: 'current',
        name: 'Mi ubicación actual',
        coordinate: userLocation
      };
      handleOriginSelect(currentLocationOrigin);
    }
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="black" />
      </TouchableOpacity>

      <Autocomplete
        data={destinations}
        value={originValue}
        onChange={setOriginValue}
        placeholder="Seleccionar origen"
        onSelect={handleOriginSelect}
        includeCurrentLocation={true}
        onUseCurrentLocation={handleUseCurrentLocation}
      />

      <Autocomplete
        data={destinations}
        value={destinationValue}
        onChange={setDestinationValue}
        placeholder="Seleccionar destino"
        onSelect={handleDestinationSelect}
      />

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
        style={[styles.startButton, (!origin || !destination) && styles.startButtonDisabled]}
        onPress={onStartNavigation}
        disabled={!origin || !destination}
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
  autocompleteContainer: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  locationIcon: {
    padding: 5,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    maxHeight: 150,
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  travelModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
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
    marginTop: 15,
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