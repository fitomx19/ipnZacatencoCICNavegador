// components/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { fetchPlaces, fetchIncidents } from '../api';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import ChatHeader from '../components/Chat/ChatHeader';
import { createSystemMessage, createLocationContext } from '../utils/chatContext';
import { sendChatMessage } from '../services/chatService';
import ChatSuggestions from '../components/Chat/ChatSuggestions';
import ChatTypingIndicator from '../components/Chat/ChatTypingIndicator';
import { isReportingIntent, extractIncidentDetails } from '../utils/incidentHandler';
import { handleIncidentReport } from '../services/incidentService';
import IncidentReportFlow from '../components/Chat/IncidentReportFlow';
import * as Location from 'expo-location'; // Añadir esta importación


const ChatScreen = () => {
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

  useEffect(() => {
    loadInitialData();
    initializeContext();
  }, []);

  useEffect(() => {
    // Obtener la ubicación del usuario al iniciar
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permiso de ubicación denegado');
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getCurrentLocation();
  }, []);

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
        text: `✅ Incidente reportado exitosamente.\n\nTipo: ${INCIDENT_TYPES[incidentData.description.toUpperCase()]?.label}\nUbicación: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}\n\nGracias por contribuir a mantener informada a la comunidad.`,
        type: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
      await loadInitialData(); // Recargar incidentes
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


  const handleCancelReport = () => {
    setIsReportingIncident(false);
    const cancelMessage = {
      id: Date.now(),
      text: 'Reporte de incidente cancelado.',
      type: 'bot'
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

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

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion);
    // Opcional: enviar el mensaje inmediatamente
    handleSendMessage(suggestion);
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

    if (isReportingIntent(messageText)) {
      setIsReportingIncident(true);
      setIsLoading(false);
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

      // Simular un pequeño retraso para mostrar el indicador de escritura
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

  const handleClear = () => {
    setMessages([]);
    initializeContext();
  };

  const renderMessages = () => {
    return (
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
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