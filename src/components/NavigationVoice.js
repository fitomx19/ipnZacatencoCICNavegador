// components/NavigationVoice.js
import React, { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import axios from 'axios';

const NavigationVoice = ({ instruction, isNavigating, origin, destination }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);

  // Función para obtener el clima
  const fetchWeather = async (lat, lon) => {
    try {
      // Reemplaza YOUR_API_KEY con tu clave de OpenWeatherMap
      const API_KEY = '31598c6ace4d1031477a492c3b9721af';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      const description = response.data.weather[0].description;
      const temp = Math.round(response.data.main.temp);
      return `${description} con temperatura de ${temp} grados`;
    } catch (error) {
      console.warn('Error al obtener el clima:', error);
      return null;
    }
  };

  const speak = async (text) => {
    try {
      if (isSpeaking) {
        await Speech.stop();
      }

      const cleanInstruction = text
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      console.log('🔊 Reproduciendo:', cleanInstruction);

      setIsSpeaking(true);
      await Speech.speak(cleanInstruction, {
        language: 'es-ES',
        rate: 0.9,
        pitch: 1.0,
        onStart: () => console.log('Iniciando reproducción'),
        onDone: () => {
          console.log('Reproducción finalizada');
          setIsSpeaking(false);
        },
        onStopped: () => {
          console.log('Reproducción detenida');
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.warn('Error en reproducción:', error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.warn('Error al reproducir:', error);
      setIsSpeaking(false);
    }
  };

  // Efecto para el mensaje de bienvenida con clima y ruta
  useEffect(() => {
    const welcomeUser = async () => {
      if (isNavigating && !hasWelcomed && origin && destination) {
        try {
          const currentHour = new Date().getHours();
          let greeting = '';

          if (currentHour >= 5 && currentHour < 12) {
            greeting = 'Buenos días';
          } else if (currentHour >= 12 && currentHour < 19) {
            greeting = 'Buenas tardes';
          } else {
            greeting = 'Buenas noches';
          }

          // Obtener el clima para la ubicación actual
          let weatherMessage = '';
          if (origin.latitude && origin.longitude) {
            const weather = await fetchWeather(origin.latitude, origin.longitude);
            if (weather) {
              weatherMessage = `El clima actual es: ${weather}. `;
              console.log('Clima actual:', weather);
            }
          }

          // Construir mensaje de ruta
          const routeMessage = `Iniciaremos la navegación desde ${origin.name || 'su ubicación actual'} 
                              hacia ${destination.name}. `;

          const welcomeMessage = `${greeting}. ${weatherMessage}${routeMessage}
                                Sistema de navegación iniciado. Siga las instrucciones para llegar 
                                a su destino de manera segura.`;
          
          await speak(welcomeMessage);
          setHasWelcomed(true);
        } catch (error) {
          console.warn('Error en mensaje de bienvenida:', error);
        }
      }
    };

    welcomeUser();

    if (!isNavigating) {
      setHasWelcomed(false);
    }
  }, [isNavigating, origin, destination]);

  // Efecto para las instrucciones de navegación
  useEffect(() => {
    if (isNavigating && instruction && hasWelcomed) {
      console.log('Nueva instrucción recibida:', instruction);
      speak(instruction);
    }

    return () => {
      if (!isNavigating) {
        Speech.stop();
      }
    };
  }, [instruction, isNavigating, hasWelcomed]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return null;
};

export default NavigationVoice;