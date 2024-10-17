// components/NavigationInstructions.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NavigationInstructions = ({ currentInstruction }) => {
  if (!currentInstruction) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{currentInstruction.replace(/<[^>]*>/g, '')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NavigationInstructions;