import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QUICK_SUGGESTIONS = [
  {
    text: "¿Cómo llegar a ESCOM?",
    type: "navigation"
  },
  {
    text: "Reportar incidente",
    type: "report"
  },
  {
    text: "Ver incidentes cercanos",
    type: "view"
  },
  {
    text: "Buscar ruta más segura",
    type: "route"
  }
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
          style={[
            styles.suggestionButton,
            suggestion.type === 'report' && styles.reportButton,
            suggestion.type === 'view' && styles.viewButton
          ]}
          onPress={() => onSuggestionPress(suggestion.text, suggestion.type)}
        >
          <Text style={[
            styles.suggestionText,
            (suggestion.type === 'report' || suggestion.type === 'view') && styles.actionButtonText
          ]}>
            {suggestion.text}
          </Text>
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
  reportButton: {
    backgroundColor: '#dc3545',
  },
  viewButton: {
    backgroundColor: '#28a745',
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  actionButtonText: {
    color: 'white',
  },
});

export default ChatSuggestions;