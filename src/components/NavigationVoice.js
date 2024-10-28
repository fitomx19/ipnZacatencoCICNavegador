// components/NavigationVoice.js
import React, { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';

const NavigationVoice = ({ instruction, isNavigating }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text) => {
    try {
      // Detener cualquier instrucción anterior
      if (isSpeaking) {
        await Speech.stop();
      }

      // Limpiar la instrucción de etiquetas HTML y caracteres especiales
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
        onStart: () => {
          console.log('Iniciando reproducción');
        },
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

  useEffect(() => {
    // Verificar la disponibilidad de voces en español
    const checkVoices = async () => {
      try {
        const availableVoices = await Speech.getAvailableVoicesAsync();
        const spanishVoices = availableVoices.filter(voice => 
          voice.language.startsWith('es')
        );
        console.log('Voces en español disponibles:', spanishVoices);
      } catch (error) {
        console.warn('Error al verificar voces:', error);
      }
    };

    checkVoices();

    // Limpieza al desmontar
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (isNavigating && instruction) {
      console.log('Nueva instrucción recibida:', instruction);
      speak(instruction);
    }

    return () => {
      if (!isNavigating) {
        Speech.stop();
      }
    };
  }, [instruction, isNavigating]);

  return null;
};

export default NavigationVoice;