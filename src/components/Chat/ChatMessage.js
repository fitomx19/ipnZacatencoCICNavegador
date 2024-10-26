import React from 'react';
import { View, Text, StyleSheet, Animated, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import NavigationPreview from './NavigationPreview';
import Markdown from 'react-native-markdown-display';

const ChatMessage = ({ message, onStartNavigation }) => {
  const isNavigationPreview = message.type === 'navigation';
  
  // Función para procesar links
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // Configuración personalizada para Markdown
  const markdownStyles = {
    body: {
      color: message.type === 'user' ? '#FFFFFF' : '#000000',
    },
    heading1: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
      color: message.type === 'user' ? '#FFFFFF' : '#000000',
    },
    heading2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 6,
      color: message.type === 'user' ? '#FFFFFF' : '#000000',
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 22,
      marginVertical: 4,
      color: message.type === 'user' ? '#FFFFFF' : '#000000',
    },
    link: {
      color: message.type === 'user' ? '#E3F2FD' : '#2196F3',
      textDecorationLine: 'underline',
    },
    list_item: {
      marginVertical: 4,
      color: message.type === 'user' ? '#FFFFFF' : '#000000',
    },
    bullet_list: {
      marginVertical: 6,
    },
    code_inline: {
      backgroundColor: message.type === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      padding: 4,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: message.type === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      padding: 8,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: message.type === 'user' ? '#FFFFFF50' : '#00000030',
      paddingLeft: 8,
      marginVertical: 8,
      opacity: 0.8,
    },
  };

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
      <Markdown
        style={markdownStyles}
        onLinkPress={handleLinkPress}
      >
        {message.text}
      </Markdown>
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
          <MaterialIcons name="android" size={24} color="#2196F3" />
        </View>
      )}
      <View style={styles.contentContainer}>
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    maxWidth: '85%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
  },
  userMessage: {
    backgroundColor: '#2196F3',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  errorMessage: {
    backgroundColor: '#FFEBEE',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#EF5350',
  },
  navigationContainer: {
    backgroundColor: 'transparent',
    padding: 0,
    maxWidth: '95%',
    shadowColor: 'transparent',
  },
  botIconContainer: {
    marginRight: 8,
    marginTop: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ChatMessage;