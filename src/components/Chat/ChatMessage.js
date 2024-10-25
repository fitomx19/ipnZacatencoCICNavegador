// components/Chat/ChatMessage.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import NavigationPreview from './NavigationPreview';

const ChatMessage = ({ message, onStartNavigation }) => {
  const isNavigationPreview = message.type === 'navigation';
  
  const renderContent = () => {
    if (isNavigationPreview) {
      return (
        <NavigationPreview
          origin={message.origin}
          destination={message.destination}
          duration={message.duration}
          distance={message.distance}
          onStartNavigation={() => onStartNavigation(message.origin, message.destination)}
        />
      );
    }

    return (
      <Text style={[
        styles.messageText,
        message.type === 'user' ? styles.userMessageText : 
        message.type === 'error' ? styles.errorMessageText : styles.botMessageText
      ]}>
        {message.text}
      </Text>
    );
  };

  return (
    <Animated.View style={[
      styles.messageContainer,
      message.type === 'user' ? styles.userMessage : 
      message.type === 'error' ? styles.errorMessage : styles.botMessage,
      isNavigationPreview && styles.navigationContainer
    ]}>
      {message.type === 'bot' && !isNavigationPreview && (
        <View style={styles.botIconContainer}>
          <MaterialIcons name="android" size={20} color="#007AFF" />
        </View>
      )}
      {renderContent()}
      {message.type === 'user' && (
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>
            {new Date(message.id).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: '85%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#F2F2F7',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  errorMessage: {
    backgroundColor: '#FFE5E5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  navigationContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    maxWidth: '95%',
  },
  botIconContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#000',
  },
  errorMessageText: {
    color: '#FF3B30',
  },
  timestamp: {
    position: 'absolute',
    right: 8,
    bottom: -18,
  },
  timestampText: {
    fontSize: 11,
    color: '#8E8E93',
  },
});

export default ChatMessage;