// components/chat/ChatSuggestions.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QUICK_SUGGESTIONS = [
  "¿Cómo llegar a ESCOM?",
  "Reportar incidente",
  "Buscar ruta más segura",
  "Ver incidentes cercanos"
];

const ChatSuggestions = ({ onSuggestionPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {QUICK_SUGGESTIONS.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionButton}
          onPress={() => onSuggestionPress(suggestion)}
        >
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  suggestionButton: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 8,
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default ChatSuggestions;