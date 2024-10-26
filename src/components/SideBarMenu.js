import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SidebarMenu = ({ isVisible, onClose, navigation }) => {
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : -300,
      damping: 20,
      stiffness: 90,
      useNativeDriver: false,
    }).start();
  }, [isVisible, slideAnim]);

  const handleNavigation = (screenName) => {
    onClose();
    navigation.navigate(screenName);
  };

  const menuItems = [
    { name: 'Home', label: 'Mapa', icon: 'map' },
    { name: 'Chat', label: 'Chat', icon: 'chatbubbles' },
    { name: 'Places', label: 'Lugares', icon: 'location' },
    { name: 'Incidents', label: 'Incidentes reportados', icon: 'warning' },
  ];

  return (
    <Animated.View style={[styles.container, { left: slideAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menú</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuItemsContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={() => handleNavigation(item.name)}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon} size={24} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 300,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  menuItemsContainer: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SidebarMenu;