// NavigationInstructions.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NavigationInstructions = ({ instructions, onCancelNavigation }) => {
  const [expanded, setExpanded] = useState(false);

  if (!instructions || instructions.length === 0) return null;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.instructionsContainer}>
        <ScrollView style={styles.scrollView}>
          {instructions.map((instruction, index) => (
            <Text key={index} style={styles.text}>
              {index + 1}. {instruction.replace(/<[^>]*>/g, '')}
            </Text>
          ))}
        </ScrollView>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancelNavigation}>
        <MaterialIcons name="cancel" size={24} color="white" />
        <Text style={styles.cancelButtonText}>Cancelar viaje</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  instructionsContainer: {
    flex: 0.7,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  cancelButton: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default NavigationInstructions;