// NavigationMenu.js
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const NavigationMenu = ({ escuelas, onSchoolSelect, onStartNavigation, onToggleTravelMode, travelMode, destination }) => {
  return (
    <View style={styles.menuContainer}>
      {escuelas.map((escuela) => (
        <Button
          key={escuela.id}
          title={escuela.name}
          onPress={() => onSchoolSelect(escuela)}
        />
      ))}
      <Button
        title={`Modo: ${travelMode === 'DRIVING' ? 'Auto' : 'Caminando'}`}
        onPress={onToggleTravelMode}
      />
      <Button 
        title="Iniciar Navegación" 
        onPress={onStartNavigation} 
        disabled={!destination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default NavigationMenu;