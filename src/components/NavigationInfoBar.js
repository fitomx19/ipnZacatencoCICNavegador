// components/NavigationInfoBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationInfoBar = ({ estimatedTime, distance, arrivalTime, onExit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{estimatedTime} min</Text>
        <Text style={styles.infoText}>{distance}</Text>
        <Text style={styles.infoText}>Llegada: {arrivalTime}</Text>
      </View>
      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <MaterialIcons name="close" size={24} color="white" />
        <Text style={styles.exitText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  exitText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default NavigationInfoBar;