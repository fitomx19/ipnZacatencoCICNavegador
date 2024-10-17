// components/EstimatedTimeDisplay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EstimatedTimeDisplay = ({ estimatedTime }) => {
  if (!estimatedTime) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tiempo estimado: {estimatedTime} minutos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EstimatedTimeDisplay;