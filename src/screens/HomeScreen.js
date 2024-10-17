import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

const escuelas = [
  { id: 1, name: 'ESCOM', coordinate: { latitude: 19.504968, longitude: -99.146936 } },
  { id: 2, name: 'ESIA ZACATENCO', coordinate: { latitude: 19.504743, longitude: -99.133908 } },
  { id: 3, name: 'ESFM', coordinate: { latitude: 19.500915, longitude: -99.134511 } },
];

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const watchPositionSubscription = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();

    return () => {
      if (watchPositionSubscription.current) {
        watchPositionSubscription.current.remove();
      }
    };
  }, []);

  const handleSchoolSelect = (school) => {
    setDestination(school.coordinate);
    setIsNavigating(false);
    setNavigationSteps([]);
    setCurrentStepIndex(0);
  };

  const handleStartNavigation = async () => {
    if (destination) {
      setIsNavigating(true);
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode.toLowerCase()}&key=${GOOGLE_MAPS_API_KEY}`
        );
        
        if (response.data.status === 'OK') {
          const steps = response.data.routes[0].legs[0].steps;
          setNavigationSteps(steps);
          setCurrentStepIndex(0);
          startLocationTracking();
        } else {
          alert('No se pudieron obtener las instrucciones de navegación');
        }
      } catch (error) {
        console.error('Error al obtener instrucciones de navegación:', error);
        alert('Error al obtener instrucciones de navegación');
      }
    } else {
      alert('Por favor, selecciona una escuela primero');
    }
  };

  const startLocationTracking = () => {
    watchPositionSubscription.current = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        updateCurrentStep(location.coords);
      }
    );
  };

  const updateCurrentStep = (currentLocation) => {
    if (navigationSteps.length > 0 && currentStepIndex < navigationSteps.length - 1) {
      const nextStep = navigationSteps[currentStepIndex + 1];
      const distanceToNextStep = calculateDistance(
        currentLocation,
        { latitude: nextStep.start_location.lat, longitude: nextStep.start_location.lng }
      );

      if (distanceToNextStep < 20) { // Si estamos a menos de 20 metros del próximo paso
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  };

  const handleIncidentMark = () => {
    console.log('Marcar incidente');
    // Aquí puedes implementar la lógica para marcar incidentes
  };

  const toggleTravelMode = () => {
    setTravelMode(prevMode => prevMode === 'DRIVING' ? 'WALKING' : 'DRIVING');
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={userLocation}
          provider={PROVIDER_GOOGLE}
          customMapStyle={[]}
        >
          <Marker coordinate={userLocation} title="Tu ubicación" />
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
      )}
      <View style={styles.buttonContainer}>
        {escuelas.map((escuela) => (
          <Button
            key={escuela.id}
            title={escuela.name}
            onPress={() => handleSchoolSelect(escuela)}
          />
        ))}
        <Button
          title={`Modo: ${travelMode === 'DRIVING' ? 'Auto' : 'Caminando'}`}
          onPress={toggleTravelMode}
        />
        <Button 
          title="Iniciar Navegación" 
          onPress={handleStartNavigation} 
          disabled={!destination}
        />
        <Button title="Marcar Incidente" onPress={handleIncidentMark} />
      </View>
      {isNavigating && navigationSteps.length > 0 && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            {navigationSteps[currentStepIndex].html_instructions.replace(/<[^>]*>/g, '')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});