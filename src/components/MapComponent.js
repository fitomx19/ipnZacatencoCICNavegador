// components/MapComponent.js
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { decode } from '@mapbox/polyline';

const MapComponent = ({ 
  userLocation, 
  destination, 
  isNavigating, 
  travelMode, 
  destinations, 
  selectedDestinationId,
  trafficInfo 
}) => {
  const getTrafficColor = (duration, distance) => {
    const speed = distance / duration; // metros por segundo
    if (speed > 13.89) return 'green'; // > 50 km/h
    if (speed > 8.33) return 'yellow'; // > 30 km/h
    return 'red'; // tráfico lento
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={userLocation}
      provider={PROVIDER_GOOGLE}
      customMapStyle={[]}
    >
      <Marker coordinate={userLocation} title="Tu ubicación">
        <MaterialIcons name="my-location" size={24} color="blue" />
      </Marker>
      {destinations.map((dest) => (
        <Marker
          key={dest.id}
          coordinate={dest.coordinate}
          title={dest.name}
          pinColor={selectedDestinationId === dest.id ? 'green' : 'red'}
        />
      ))}
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
});

export default MapComponent;