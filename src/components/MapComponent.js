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
  trafficInfo,
  incidents
}) => {
  const [showZacatenco, setShowZacatenco] = useState(false);

  const getTrafficColor = (duration, distance) => {
    const speed = distance / duration;
    if (speed > 13.89) return 'green';
    if (speed > 8.33) return 'yellow';
    return 'red';
  };

  const getIncidentIcon = (incidentType) => {
    switch (incidentType) {
      case 'pothole':
        return 'warning';
      case 'flood':
        return 'water-damage';
      case 'collapse':
        return 'terrain';
      case 'collision':
        return 'car-crash';
      case 'breakdown':
        return 'car-repair';
      default:
        return 'report-problem';
    }
  };

  const initialRegion = userLocation && userLocation.latitude && userLocation.longitude
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : DEFAULT_LOCATION;

  const toggleZacatenco = () => {
    setShowZacatenco(!showZacatenco);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        {origin && origin.id !== 'current' && origin.coordinate && (
          <Marker coordinate={origin.coordinate} title={origin.name} pinColor="green" />
        )}
        {destination && destination.coordinate && (
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
        {isNavigating && incidents && incidents.map((incident, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: incident.latitude,
              longitude: incident.longitude
            }}
            title={incident.description}
          >
            <MaterialIcons name={getIncidentIcon(incident.type)} size={24} color="red" />
          </Marker>
        ))}
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