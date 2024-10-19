import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Modal, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

import MapComponent from '../components/MapComponent';
import NavigationMenu from '../components/NavigationMenu';
import CurrentInstruction from '../components/CurrentInstruction';
import FloatingActionButton from '../components/FloatingActionButton';
import IncidentReportButton from '../components/IncidentReportButton';
import NavigationInfoBar from '../components/NavigationInfoBar';
import SidebarMenu from '../components/SideBarMenu';
import { fetchPlaces } from '../api';

export default function HomeScreen({ navigation, route }) {
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [trafficInfo, setTrafficInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const watchPositionSubscription = useRef(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible(prevState => !prevState);
  }, []);

  useEffect(() => {
    navigation.setParams({ toggleSidebar: toggleSidebar });
  }, [navigation, toggleSidebar]);

  useEffect(() => {
    if (route.params?.showMenu) {
      setIsSidebarVisible(true);
    }
  }, [route.params?.showMenu]);

  useEffect(() => {
    const loadPlacesAndLocation = async () => {
      try {
        const fetchedPlaces = await fetchPlaces();
        setPlaces(fetchedPlaces);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (error) {
        console.error('Error loading places and location:', error);
        setErrorMsg('Error loading places and location');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlacesAndLocation();

    return () => {
      if (watchPositionSubscription.current) {
        watchPositionSubscription.current.remove();
      }
    };
  }, []);

  const handleDestinationSelect = useCallback((dest) => {
    setDestination(dest);
    setSelectedDestinationId(dest._id);
    setIsNavigating(false);
    setNavigationSteps([]);
    setCurrentStepIndex(0);
    setEstimatedTime(null);
    setTrafficInfo(null);
  }, []);

  const handleOriginSelect = useCallback((selectedOrigin) => {
    setOrigin(selectedOrigin);
  }, []);

  const fetchDirectionsWithTraffic = useCallback(async () => {
    if (destination && origin) {
      try {
        let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode.toLowerCase()}&key=${GOOGLE_MAPS_API_KEY}&language=es`;
        
        if (travelMode === 'DRIVING') {
          url += '&departure_time=now&traffic_model=best_guess';
        }

        const response = await axios.get(url);
        
        if (response.data.status === 'OK') {
          const route = response.data.routes[0];
          setNavigationSteps(route.legs[0].steps.map(step => step.html_instructions));
          setCurrentStepIndex(0);
          startLocationTracking();
          
          const duration = travelMode === 'DRIVING' ? route.legs[0].duration_in_traffic.value : route.legs[0].duration.value;
          const durationInMinutes = Math.round(duration / 60);
          setEstimatedTime(durationInMinutes);
          
          setDistance(route.legs[0].distance.text);
          
          const arrival = new Date(Date.now() + duration * 1000);
          setArrivalTime(arrival.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    
          const trafficSegments = route.legs[0].steps.map(step => ({
            points: step.polyline.points,
            duration: step.duration.value,
            distance: step.distance.value,
          }));
          setTrafficInfo(trafficSegments);
          setIsNavigating(true);
          setIsMenuVisible(false);
        } else {
          alert('No se pudieron obtener las instrucciones de navegación');
        }
      } catch (error) {
        console.error('Error al obtener instrucciones de navegación:', error);
        alert('Error al obtener instrucciones de navegación');
      }
    } else {
      alert('Por favor, selecciona un origen y un destino primero');
    }
  }, [destination, origin, travelMode]);

  const startLocationTracking = useCallback(() => {
    if (watchPositionSubscription.current) {
      watchPositionSubscription.current.remove();
    }
    
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (location) => {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        updateCurrentStep(location.coords);
      }
    ).then(subscription => {
      watchPositionSubscription.current = subscription;
    }).catch(error => {
      console.error("Error starting location tracking:", error);
    });
  }, []);

  const updateCurrentStep = useCallback((currentLocation) => {
    if (navigationSteps.length > 0 && currentStepIndex < navigationSteps.length - 1) {
      const nextStep = navigationSteps[currentStepIndex + 1];
      const distanceToNextStep = calculateDistance(
        currentLocation,
        { latitude: nextStep.start_location.lat, longitude: nextStep.start_location.lng }
      );

      if (distanceToNextStep < 20) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  }, [navigationSteps, currentStepIndex]);

  const calculateDistance = (point1, point2) => {
    const R = 6371e3;
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const toggleTravelMode = useCallback((mode) => {
    setTravelMode(mode);
    if (isNavigating && destination) {
      fetchDirectionsWithTraffic();
    }
  }, [isNavigating, destination, fetchDirectionsWithTraffic]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const reportIncident = () => {
    if (userLocation) {
      console.log(`Incidente reportado en: Latitud ${userLocation.latitude}, Longitud ${userLocation.longitude}`);
      alert('Incidente reportado. Gracias por tu colaboración.');
    } else {
      alert('No se pudo obtener tu ubicación actual. Por favor, inténtalo de nuevo.');
    }
  };

  const cancelNavigation = useCallback(() => {
    setIsNavigating(false);
    setNavigationSteps([]);
    setCurrentStepIndex(0);
    setEstimatedTime(null);
    setDistance(null);
    setArrivalTime(null);
    setTrafficInfo(null);
    setDestination(null);
    setSelectedDestinationId(null);
    
    if (watchPositionSubscription.current) {
      watchPositionSubscription.current.remove();
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando lugares y ubicación...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapComponent
          userLocation={userLocation}
          origin={origin}
          destination={destination}
          isNavigating={isNavigating}
          travelMode={travelMode}
          destinations={places}
          selectedDestinationId={selectedDestinationId}
          trafficInfo={trafficInfo}
        />
      )}
      
      {isNavigating ? (
        <>
          <CurrentInstruction instruction={navigationSteps[currentStepIndex]} allInstructions={navigationSteps} />
          <IncidentReportButton style={styles.topRightButton} onPress={reportIncident} />
          <NavigationInfoBar 
            estimatedTime={estimatedTime}
            distance={distance}
            arrivalTime={arrivalTime}
            onExit={cancelNavigation}
          />
        </>
      ) : (
        <>
          <FloatingActionButton onPress={toggleMenu} />
          <IncidentReportButton onPress={reportIncident} />
        </>
      )}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}
      >
        <View style={styles.centeredView}>
        <NavigationMenu
            destinations={places}
            onDestinationSelect={handleDestinationSelect}
            onStartNavigation={fetchDirectionsWithTraffic}
            onToggleTravelMode={toggleTravelMode}
            travelMode={travelMode}
            destination={destination}
            onClose={toggleMenu}
            selectedDestinationId={selectedDestinationId}
            userLocation={userLocation}
            onOriginSelect={handleOriginSelect}
          />
        </View>
      </Modal>

      <SidebarMenu 
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

