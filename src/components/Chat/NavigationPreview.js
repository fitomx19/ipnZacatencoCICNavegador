// components/Chat/RichMessages/NavigationPreview.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationPreview = ({ origin, destination, duration, distance, onStartNavigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        <View style={styles.locationRow}>
          <MaterialIcons name="my-location" size={20} color="#007AFF" />
          <Text style={styles.locationText} numberOfLines={1}>
            {origin || 'Tu ubicación'}
          </Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeDashed} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.locationRow}>
          <MaterialIcons name="place" size={20} color="#FF3B30" />
          <Text style={styles.locationText} numberOfLines={1}>
            {destination}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <MaterialIcons name="timer" size={20} color="#666" />
          <Text style={styles.detailText}>{duration}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailBox}>
          <MaterialIcons name="straighten" size={20} color="#666" />
          <Text style={styles.detailText}>{distance}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={onStartNavigation}
        activeOpacity={0.7}
      >
        <MaterialIcons name="navigation" size={20} color="white" />
        <Text style={styles.buttonText}>Iniciar Navegación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfo: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  routeDashed: {
    flex: 1,
    height: 1,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationPreview;
