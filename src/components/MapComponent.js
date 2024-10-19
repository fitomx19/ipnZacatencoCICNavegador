import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { decode } from '@mapbox/polyline';

const DEFAULT_LOCATION = {
  latitude: 19.504968,
  longitude: -99.146936,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const ZACATENCO_COORDINATES = [
  { latitude: 19.510000, longitude: -99.133000 },
  { latitude: 19.510000, longitude: -99.129000 },
  { latitude: 19.495000, longitude: -99.129000 },
  { latitude: 19.495000, longitude: -99.133000 },
];

const MapComponent = ({
  userLocation,
  origin,
  destination,
  isNavigating,
  travelMode,
  trafficInfo
}) => {
  const [showZacatenco, setShowZacatenco] = useState(false);

  const getTrafficColor = (duration, distance) => {
    const speed = distance / duration;
    if (speed > 13.89) return 'green';
    if (speed > 8.33) return 'yellow';
    return 'red';
  };

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

  const toggleZacatenco = () => {
    setShowZacatenco(!showZacatenco);
  };

  return (
    <View style={styles.container}>
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
        {showZacatenco && (
          <Polygon
            coordinates={ZACATENCO_COORDINATES}
            fillColor="rgba(128, 0, 32, 0.3)"
            strokeColor="rgba(128, 0, 32, 0.8)"
            strokeWidth={2}
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.zacatencoButton} onPress={toggleZacatenco}>
        <MaterialIcons name={showZacatenco ? "visibility-off" : "visibility"} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  zacatencoButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    padding: 10,
  },
});

export default MapComponent;