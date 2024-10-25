// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchPlaces, fetchIncidents } from '../api';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatSuggestions from '../components/Chat/ChatSuggestions';
import ChatTypingIndicator from '../components/Chat/ChatTypingIndicator';
import IncidentReportFlow from '../components/Chat/IncidentReportFlow';
import { createSystemMessage, createLocationContext } from '../utils/chatContext';
import { sendChatMessage } from '../services/chatService';
import { detectIntent, INTENT_TYPES, formatIncidentsList } from '../utils/incidentHandler';
import { handleIncidentReport } from '../services/incidentService';

const ChatScreen = () => {
  // Estados
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReportingIncident, setIsReportingIncident] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const flatListRef = useRef();

  // Efectos
  useEffect(() => {
    loadInitialData();
    initializeContext();
    setupLocation();
  }, []);


  const handleStartNavigation = (origin, destination) => {
    navigation.navigate('Home', {
      startNavigation: true,
      origin,
      destination,
    });
  };

  const processNavigationResponse = (responseText) => {
    // Detectar si la respuesta incluye información de navegación
    if (responseText.includes('ruta') || responseText.includes('llegar')) {
      const navigationData = {
        id: Date.now(),
        type: 'navigation',
        origin: userLocation ? 'Tu ubicación actual' : null,
        destination: 'ESCOM', // Extraer del texto
        duration: '15 min', // Extraer o calcular
        distance: '1.2 km', // Extraer o calcular
      };
      
      setMessages(prev => [...prev, navigationData]);
    } else {
      const botResponse = {
        id: Date.now(),
        text: responseText,
        type: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }
  };
  
  // Configuración de ubicación
  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tu ubicación para reportar incidentes.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación. Algunas funciones podrían estar limitadas.',
        [{ text: 'OK' }]
      );
    }
  };

  // Carga inicial de datos
  const loadInitialData = async () => {
    try {
      const [placesData, incidentsData] = await Promise.all([
        fetchPlaces(),
        fetchIncidents()
      ]);
      setPlaces(placesData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const initializeContext = () => {
    setConversationContext([createSystemMessage()]);
  };

  // Manejo de incidentes
  const handleIncidentType = async (incidentData) => {
    setIsReportingIncident(false);
    setIsLoading(true);

    try {
      const response = await handleIncidentReport(
        userLocation,
        incidentData.description,
        incidentData.details
      );

      const botResponse = {
        id: Date.now(),
        text: `✅ Incidente reportado exitosamente.\n\nTipo: ${incidentData.description}\nDetalles: ${incidentData.details}\nUbicación: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}\n\nGracias por contribuir a mantener informada a la comunidad.`,
        type: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
      await loadInitialData();
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: 'Lo siento, hubo un error al reportar el incidente. Por favor, intenta de nuevo.',
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleViewIncidents = async () => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      await loadInitialData();
      const formattedIncidents = formatIncidentsList(incidents, userLocation);
      
      const botResponse = {
        id: Date.now(),
        text: formattedIncidents,
        type: 'bot'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: 'Lo siento, hubo un error al obtener los incidentes. Por favor, intenta de nuevo.',
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Manejo de mensajes y sugerencias
  const handleSuggestionPress = (suggestion, type) => {
    setInputText(suggestion);
    if (type === 'view') {
      handleViewIncidents();
    } else {
      handleSendMessage(suggestion);
    }
  };

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    const intent = detectIntent(messageText);

    if (intent === INTENT_TYPES.REPORT_INCIDENT) {
      setIsReportingIncident(true);
      setIsLoading(false);
      setIsTyping(false);
      return;
    }

    if (intent === INTENT_TYPES.VIEW_INCIDENTS) {
      handleViewIncidents();
      return;
    }

    try {
      const updatedContext = [
        ...conversationContext,
        { role: "user", content: messageText },
        createLocationContext(places, incidents)
      ];

      const botResponseText = await sendChatMessage(updatedContext);
      
      setConversationContext(prev => [
        ...prev,
        { role: "user", content: messageText },
        { role: "assistant", content: botResponseText }
      ]);

      await new Promise(resolve => setTimeout(resolve, 500));

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        type: 'bot'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleCancelReport = () => {
    setIsReportingIncident(false);
    const cancelMessage = {
      id: Date.now(),
      text: 'Reporte de incidente cancelado.',
      type: 'bot'
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleClear = () => {
    setMessages([]);
    initializeContext();
  };

  // Renderizado
// Modifica el renderMessages:
const renderMessages = () => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={({ item }) => (
        <ChatMessage 
          message={item} 
          onStartNavigation={handleStartNavigation}
        />
      )}
      keyExtractor={item => item.id.toString()}
      onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      ListHeaderComponent={<ChatSuggestions onSuggestionPress={handleSuggestionPress} />}
      ListFooterComponent={
        <>
          {isTyping && <ChatTypingIndicator />}
          {isReportingIncident && (
            <IncidentReportFlow 
              onSubmit={handleIncidentType}
              onCancel={handleCancelReport}
            />
          )}
        </>
      }
      contentContainerStyle={styles.messagesContainer}
    />
  );
};

  return (
    <View style={styles.container}>
      <ChatHeader onClear={handleClear} />
      {renderMessages()}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={() => handleSendMessage()}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
});

export default ChatScreen;