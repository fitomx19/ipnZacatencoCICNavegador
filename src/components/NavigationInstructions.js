

// NavigationInstructions.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NavigationInstructions = ({ currentInstruction }) => {
  return (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionText}>
        {currentInstruction.replace(/<[^>]*>/g, '')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NavigationInstructions;