// components/chat/ChatHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatHeader = ({ onClear }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Asistente de Navegación</Text>
      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <MaterialIcons name="delete-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
});

export default ChatHeader;