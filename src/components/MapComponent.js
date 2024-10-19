// components/MapComponent.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { decode } from '@mapbox/polyline';

const DEFAULT_LOCATION = {
  latitude: 19.504968, // Coordenada de ESCOM como ubicación por defecto
  longitude: -99.146936,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapComponent = ({
  userLocation,
  origin,
  destination,
  isNavigating,
  travelMode,
  trafficInfo
}) => {
  const getTrafficColor = (duration, distance) => {
    const speed = distance / duration; // metros por segundo
    if (speed > 13.89) return 'green'; // > 50 km/h
    if (speed > 8.33) return 'yellow'; // > 30 km/h
    return 'red'; // tráfico lento
  };

  // Usar ubicación por defecto si userLocation es nulo
  const initialRegion = userLocation && userLocation.latitude && userLocation.longitude
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : DEFAULT_LOCATION;

  if (!initialRegion.latitude || !initialRegion.longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo obtener la ubicación. Por favor, verifica los permisos de ubicación.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      provider={PROVIDER_GOOGLE}
      customMapStyle={[]}
    >
      {userLocation && userLocation.latitude && userLocation.longitude && (
        <Marker coordinate={userLocation} title="Tu ubicación">
          <MaterialIcons name="my-location" size={24} color="blue" />
        </Marker>
      )}
      {origin && origin.id !== 'current' && origin.coordinate && origin.coordinate.latitude && origin.coordinate.longitude && (
        <Marker coordinate={origin.coordinate} title={origin.name} pinColor="green" />
      )}
      {destination && destination.coordinate && destination.coordinate.latitude && destination.coordinate.longitude && (
        <Marker coordinate={destination.coordinate} title={destination.name} pinColor="red" />
      )}
      {isNavigating && trafficInfo && trafficInfo.map((segment, index) => {
        const points = decode(segment.points).map(point => ({
          latitude: point[0],
          longitude: point[1]
        }));
        return (
          <Polyline
            key={index}
            coordinates={points}
            strokeWidth={4}
            strokeColor={getTrafficColor(segment.duration, segment.distance)}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
});

export default MapComponent;