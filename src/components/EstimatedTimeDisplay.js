// EstimatedTimeDisplay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EstimatedTimeDisplay = ({ estimatedTime }) => {
  if (!estimatedTime) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tiempo estimado: {estimatedTime} min</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#8B0000', // Color guinda
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default EstimatedTimeDisplay;