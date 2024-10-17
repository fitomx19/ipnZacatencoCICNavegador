// MapComponent.js
import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { MaterialIcons } from '@expo/vector-icons';

const MapComponent = ({ userLocation, destination, isNavigating, travelMode, escuelas, onCenterMap }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      centerMap();
    }
  }, [userLocation]);

  const centerMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={userLocation}
        provider={PROVIDER_GOOGLE}
        customMapStyle={[]}
      >
        <Marker coordinate={userLocation} title="Tu ubicación">
          <MaterialIcons name="navigation" size={24} color="blue" />
        </Marker>
        {destination && (
          <Marker coordinate={destination} title="Destino" />
        )}
        {escuelas.map((escuela) => (
          <Marker
            key={escuela.id}
            coordinate={escuela.coordinate}
            title={escuela.name}
          />
        ))}
        {isNavigating && destination && (
          <MapViewDirections
            origin={userLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
            mode={travelMode}
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MapComponent;