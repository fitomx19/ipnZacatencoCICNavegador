// components/chat/ChatInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatInput = ({ inputText, setInputText, sendMessage, isLoading }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Escribe tu mensaje..."
        multiline
        maxLength={500}
      />
      <TouchableOpacity 
        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
        onPress={sendMessage}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <MaterialIcons name="send" size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
});

export default ChatInput;