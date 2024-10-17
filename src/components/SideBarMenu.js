// components/SideBarMenu.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SidebarMenu = ({ isVisible, onClose, navigation }) => {
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.container, { left: slideAnim }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('Home');
          onClose();
        }}
      >
        <Text style={styles.menuItemText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('Places');
          onClose();
        }}
      >
        <Text style={styles.menuItemText}>Lugares</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
  },
});

export default SidebarMenu;