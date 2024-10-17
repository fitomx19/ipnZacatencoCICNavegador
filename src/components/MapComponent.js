// MapComponent.js
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { MaterialIcons } from '@expo/vector-icons';

const MapComponent = ({ userLocation, destination, isNavigating, travelMode, destinations, selectedDestinationId }) => {
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
      {isNavigating && destination && (
        <MapViewDirections
          origin={userLocation}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
          mode={travelMode.toLowerCase()}
          />
        )}
      </MapView>
    );
  };
  
  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });
  
  export default MapComponent;