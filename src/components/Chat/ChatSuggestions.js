import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QUICK_SUGGESTIONS = [
  {
    text: "¿Cómo llegar a ESCOM?",
    type: "navigation",
    icon: "🗺️"
  },
  {
    text: "Reportar incidente",
    type: "report",
    icon: "⚠️"
  },
  {
    text: "Ver incidentes cercanos",
    type: "view",
    icon: "👁️"
  },
  {
    text: "Buscar ruta más segura",
    type: "route",
    icon: "🛡️"
  }
];

const ChatSuggestions = ({ onSuggestionPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {QUICK_SUGGESTIONS.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.suggestionButton,
            suggestion.type === 'report' && styles.reportButton,
            suggestion.type === 'view' && styles.viewButton,
            suggestion.type === 'navigation' && styles.navigationButton,
            suggestion.type === 'route' && styles.routeButton,
          ]}
          onPress={() => onSuggestionPress(suggestion.text, suggestion.type)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{suggestion.icon}</Text>
          <Text style={[
            styles.suggestionText,
            (suggestion.type === 'report' || 
             suggestion.type === 'view' || 
             suggestion.type === 'navigation' || 
             suggestion.type === 'route') && styles.actionButtonText
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
    maxHeight: 65,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navigationButton: {
    backgroundColor: '#4361ee',
  },
  reportButton: {
    backgroundColor: '#ef233c',
  },
  viewButton: {
    backgroundColor: '#2a9d8f',
  },
  routeButton: {
    backgroundColor: '#7209b7',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ChatSuggestions;