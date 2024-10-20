// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import Incidents from './src/screens/Incidents';

const Stack = createStackNavigator();

const HeaderLeft = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
    <Ionicons name="menu" size={24} color="black" />
  </TouchableOpacity>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation, route }) => ({
            title: 'IPN Zacatenco CIC Navegador',
            headerLeft: () => (
              <HeaderLeft onPress={() => route.params?.toggleSidebar()} />
            ),
          })}
        />
        <Stack.Screen 
          name="Places" 
          component={PlacesScreen} 
          options={{ title: 'Lugares' }}
        />
        <Stack.Screen 
          name="Incidents" 
          component={Incidents} 
          options={{ title: 'Incidentes' }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}