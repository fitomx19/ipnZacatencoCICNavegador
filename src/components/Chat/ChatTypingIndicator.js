// components/chat/ChatTypingIndicator.js
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const TypingDot = ({ delay }) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.dot, { opacity }]} />
  );
};

const ChatTypingIndicator = () => {
  return (
    <View style={styles.container}>
      <TypingDot delay={0} />
      <TypingDot delay={200} />
      <TypingDot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '50%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginHorizontal: 3,
  },
});

export default ChatTypingIndicator;