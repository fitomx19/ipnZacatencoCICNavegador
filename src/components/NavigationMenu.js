import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, Keyboard, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LocationInput = ({ value, onChange, placeholder, onSelect, includeCurrentLocation, onUseCurrentLocation, data }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('LocationInput useEffect - value:', value);
    if (value) {
      const filtered = data.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      console.log('Filtered data:', filtered);
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [value, data]);

  const handleSelect = (item) => {
    console.log('handleSelect called with item:', item);
    onChange(item.name);
    onSelect(item);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  return (
    <View style={styles.locationInputContainer}>
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <MaterialIcons name="place" size={20} color="#007AFF" style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            console.log('TextInput onChangeText:', text);
            onChange(text);
          }}
          placeholder={placeholder}
          onFocus={() => {
            console.log('TextInput onFocus');
            setIsFocused(true);
          }}
          onBlur={() => {
            console.log('TextInput onBlur');
            // Delay hiding suggestions to allow tap to register
            setTimeout(() => setIsFocused(false), 200);
          }}
        />
        {includeCurrentLocation && (
          <TouchableOpacity onPress={() => {
            console.log('Current location button pressed');
            onUseCurrentLocation();
          }} style={styles.locationIcon}>
            <MaterialIcons name="my-location" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      {filteredData.length > 0 && isFocused && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id.toString()}
          style={styles.suggestionList}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                console.log('Suggestion item pressed:', item);
                handleSelect(item);
              }}
            >
              <MaterialIcons name="place" size={16} color="#007AFF" style={styles.suggestionIcon} />
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
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
  onClose,
  userLocation,
  onOriginSelect
}) => {
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  console.log('NavigationMenu render - originValue:', originValue, 'destinationValue:', destinationValue);

  const handleOriginSelect = (selectedOrigin) => {
    console.log('handleOriginSelect called with:', selectedOrigin);
    setOriginValue(selectedOrigin.name);
    setOrigin(selectedOrigin);
    onOriginSelect(selectedOrigin);
  };

  const handleDestinationSelect = (dest) => {
    console.log('handleDestinationSelect called with:', dest);
    setDestinationValue(dest.name);
    setDestination(dest);
    onDestinationSelect(dest);
  };

  const handleUseCurrentLocation = () => {
    console.log('handleUseCurrentLocation called, userLocation:', userLocation);
    if (userLocation) {
      const currentLocationOrigin = {
        _id: 'current',
        name: 'Mi ubicación actual',
        coordinate: userLocation
      };
      handleOriginSelect(currentLocationOrigin);
    }
  };

  const handleStartNavigation = () => {
    console.log('handleStartNavigation called, origin:', origin, 'destination:', destination);
    if (origin && destination) {
      onStartNavigation(origin, destination);
      onClose();
    }
  };

  return (
    <SafeAreaView style={styles.menuContainer}>
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Planear tu ruta</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <LocationInput
        value={originValue}
        onChange={(text) => {
          console.log('Origin onChange:', text);
          setOriginValue(text);
        }}
        placeholder="Seleccionar origen"
        onSelect={handleOriginSelect}
        includeCurrentLocation={true}
        onUseCurrentLocation={handleUseCurrentLocation}
        data={destinations}
      />

      <LocationInput
        value={destinationValue}
        onChange={(text) => {
          console.log('Destination onChange:', text);
          setDestinationValue(text);
        }}
        placeholder="Seleccionar destino"
        onSelect={handleDestinationSelect}
        data={destinations}
      />

      <View style={styles.travelModeContainer}>
        {['DRIVING', 'WALKING', 'BICYCLING'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.travelModeButton, travelMode === mode && styles.activeTravelMode]}
            onPress={() => {
              console.log('Travel mode selected:', mode);
              onToggleTravelMode(mode);
            }}
          >
            <MaterialIcons
              name={mode === 'DRIVING' ? 'directions-car' : mode === 'WALKING' ? 'directions-walk' : 'directions-bike'}
              size={20}
              color={travelMode === mode ? 'white' : '#007AFF'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.startButton, (!origin || !destination) && styles.startButtonDisabled]}
        onPress={handleStartNavigation}
        disabled={!origin || !destination}
      >
        <Text style={styles.startButtonText}>Iniciar Navegación</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    padding: 5,
  },
  locationInputContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    height: 40,
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  locationIcon: {
    padding: 5,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    maxHeight: 150,
    marginTop: 5,
    backgroundColor: 'white',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 5,
  },
  suggestionText: {
    fontSize: 14,
  },
  travelModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 15,
  },
  travelModeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTravelMode: {
    backgroundColor: '#007AFF',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  startButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  startButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NavigationMenu;