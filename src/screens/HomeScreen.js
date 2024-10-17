// HomeScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

import MapComponent from '../components/MapComponent';
import NavigationMenu from '../components/NavigationMenu';
import NavigationInstructions from '../components/NavigationInstructions';
import FloatingActionButton from '../components/FloatingActionButton';
import IncidentReportButton from '../components/IncidentReportButton';
import EstimatedTimeDisplay from '../components/EstimatedTimeDisplay';
import SidebarMenu from '../components/SideBarMenu';
 
const destinations = [
    { id: 1, name: 'ESCOM', coordinate: { latitude: 19.504968, longitude: -99.146936 } },
    { id: 2, name: 'ESIA ZACATENCO', coordinate: { latitude: 19.504743, longitude: -99.133908 } },
    { id: 3, name: 'ESFM', coordinate: { latitude: 19.500915, longitude: -99.134511 } },
    { id: 4, name: 'METROBUS SAN JOSE DE LA ESCALERA', coordinate: { latitude: 19.52312, longitude: -99.16593 } },
  ];
  
  export default function HomeScreen({ navigation, route }) {
      const [userLocation, setUserLocation] = useState(null);
      const [destination, setDestination] = useState(null);
      const [selectedDestinationId, setSelectedDestinationId] = useState(null);
      const [travelMode, setTravelMode] = useState('DRIVING');
      const [errorMsg, setErrorMsg] = useState(null);
      const [isNavigating, setIsNavigating] = useState(false);
      const [navigationSteps, setNavigationSteps] = useState([]);
      const [currentStepIndex, setCurrentStepIndex] = useState(0);
      const [isMenuVisible, setIsMenuVisible] = useState(false);
      const [estimatedTime, setEstimatedTime] = useState(null);
      const watchPositionSubscription = useRef(null);
      const [isSidebarVisible, setIsSidebarVisible] = useState(false)

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
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        })();
    
        return () => {
          if (watchPositionSubscription.current) {
            watchPositionSubscription.current.remove();
          }
        };
      }, []);
    
      const handleDestinationSelect = (dest) => {
        setDestination(dest.coordinate);
        setSelectedDestinationId(dest.id);
        setIsNavigating(false);
        setNavigationSteps([]);
        setCurrentStepIndex(0);
        setEstimatedTime(null);
      };

      const fetchDirectionsWithTraffic = async () => {
        if (destination) {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode.toLowerCase()}&departure_time=now&traffic_model=best_guess&key=${GOOGLE_MAPS_API_KEY}`
            );
            
            if (response.data.status === 'OK') {
              const route = response.data.routes[0];
              setNavigationSteps(route.legs[0].steps);
              setCurrentStepIndex(0);
              startLocationTracking();
              
              // Set estimated time with traffic
              const durationInTraffic = route.legs[0].duration_in_traffic.value;
              const durationInMinutes = Math.round(durationInTraffic / 60);
              setEstimatedTime(durationInMinutes);
    
              // Extract traffic information
              const trafficSegments = route.legs[0].steps.map(step => ({
                points: step.polyline.points,
                duration: step.duration.value,
                distance: step.distance.value,
              }));
              setTrafficInfo(trafficSegments);
            } else {
              alert('No se pudieron obtener las instrucciones de navegación');
            }
          } catch (error) {
            console.error('Error al obtener instrucciones de navegación:', error);
            alert('Error al obtener instrucciones de navegación');
          }
        }
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
              
              // Set estimated time
              const durationInSeconds = response.data.routes[0].legs[0].duration.value;
              const durationInMinutes = Math.round(durationInSeconds / 60);
              setEstimatedTime(durationInMinutes);
            } else {
              alert('No se pudieron obtener las instrucciones de navegación');
            }
          } catch (error) {
            console.error('Error al obtener instrucciones de navegación:', error);
            alert('Error al obtener instrucciones de navegación');
          }
          setIsMenuVisible(false);
        } else {
          alert('Por favor, selecciona un destino primero');
        }
      };
    
      const startLocationTracking = () => {
        watchPositionSubscription.current = Location.watchPositionAsync(
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
    
      const toggleTravelMode = (mode) => {
        setTravelMode(mode);
      };
    
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
    
      if (errorMsg) {
        return <Text>{errorMsg}</Text>;
      }
    
      return (
        <View style={styles.container}>
          {userLocation && (
            <MapComponent
              userLocation={userLocation}
              destination={destination}
              isNavigating={isNavigating}
              travelMode={travelMode}
              destinations={destinations}
              selectedDestinationId={selectedDestinationId}
            />
          )}
          
          <FloatingActionButton onPress={toggleMenu} />
          <IncidentReportButton onPress={reportIncident} />
          
          <EstimatedTimeDisplay estimatedTime={estimatedTime} />
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={isMenuVisible}
            onRequestClose={toggleMenu}
          >
            <View style={styles.centeredView}>
              <NavigationMenu
                destinations={destinations}
                onDestinationSelect={handleDestinationSelect}
                onStartNavigation={handleStartNavigation}
                onToggleTravelMode={toggleTravelMode}
                travelMode={travelMode}
                destination={destination}
                onClose={toggleMenu}
              />
            </View>
          </Modal>
          
          {isNavigating && navigationSteps.length > 0 && (
            <NavigationInstructions currentInstruction={navigationSteps[currentStepIndex].html_instructions} />
          )}
    
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
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      estimatedTimeContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
      },
      estimatedTimeText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });