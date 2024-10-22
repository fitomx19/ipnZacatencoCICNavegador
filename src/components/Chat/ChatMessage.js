import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatMessage = ({ message }) => {
  return (
    <View style={[
      styles.messageContainer,
      message.type === 'user' ? styles.userMessage : 
      message.type === 'error' ? styles.errorMessage : styles.botMessage
    ]}>
      {message.type === 'bot' && (
        <View style={styles.botIconContainer}>
          <MaterialIcons name="android" size={20} color="#007AFF" />
        </View>
      )}
      <Text style={[
        styles.messageText,
        message.type === 'user' ? styles.userMessageText : 
        message.type === 'error' ? styles.errorMessageText : styles.botMessageText
      ]}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  errorMessage: {
    backgroundColor: '#FFE5E5',
    alignSelf: 'flex-start',
  },
  botIconContainer: {
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  errorMessageText: {
    color: '#FF0000',
  },
});

export default ChatMessage;