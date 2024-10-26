import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ChatHeader = ({ onClear }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Actualizar fecha
    const updateDate = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentDate(now.toLocaleDateString('es-MX', options));
    };
    
    updateDate();
    const interval = setInterval(updateDate, 60000); // Actualizar cada minuto

    // Obtener ubicación
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // Aquí podrías hacer una llamada a una API de clima usando
        // location.coords.latitude y location.coords.longitude
        // Por ahora simulamos datos de clima
        setWeather({
          temp: '24°C',
          condition: 'sunny'
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
      setLoading(false);
    };

    getLocation();

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'sunny';
      case 'cloudy':
        return 'cloudy';
      case 'rainy':
        return 'rainy';
      default:
        return 'partly-sunny';
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior con título y botón de borrar */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Asistente de Navegación</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <MaterialIcons name="delete-outline" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>

      {/* Barra de información */}
      <View style={styles.infoBar}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="event" size={16} color="#666" style={styles.icon} />
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        
        {!loading && (
          <View style={styles.locationContainer}>
            {location ? (
              <>
                <MaterialIcons name="location-on" size={16} color="#666" style={styles.icon} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location.coords ? 
                    `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` :
                    'Ubicación no disponible'
                  }
                </Text>
              </>
            ) : (
              <Text style={styles.locationText}>Ubicación no disponible</Text>
            )}
          </View>
        )}

        {weather && (
          <View style={styles.weatherContainer}>
            <Ionicons 
              name={getWeatherIcon(weather.condition)} 
              size={16} 
              color="#666" 
              style={styles.icon}
            />
            <Text style={styles.weatherText}>{weather.temp}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3',
    letterSpacing: 0.5,
  },
  clearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
    marginHorizontal: 8,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  weatherText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});

export default ChatHeader;