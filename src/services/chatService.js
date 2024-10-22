// services/chatService.js
import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
import { OPENAI_API_KEY } from '@env';

export const sendChatMessage = async (context) => {
  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-4o-mini-2024-07-18",
      messages: context,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw error;
  }
};

export const preprocessUserMessage = (message) => {
  // Extraer información clave del mensaje del usuario
  const extractedInfo = {
    locations: extractLocations(message),
    transportMode: extractTransportMode(message),
    isIncidentReport: checkIfIncidentReport(message),
  };

  return {
    original: message,
    processed: extractedInfo,
  };
};

const extractLocations = (message) => {
  // Implementar extracción de nombres de lugares
  const locationRegex = /(hacia|a|desde|en)\s+([A-ZÁ-Ú][a-zá-ú\s]+)/g;
  return [...message.matchAll(locationRegex)].map(match => match[2]);
};

const extractTransportMode = (message) => {
  const transportModes = {
    caminando: ['caminando', 'a pie', 'andando'],
    auto: ['auto', 'carro', 'coche', 'manejando', 'conduciendo'],
    bicicleta: ['bici', 'bicicleta', 'ciclista'],
  };

  for (const [mode, keywords] of Object.entries(transportModes)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return mode;
    }
  }
  return null;
};

const checkIfIncidentReport = (message) => {
  const reportKeywords = ['reportar', 'incidente', 'accidente', 'problema'];
  return reportKeywords.some(keyword => message.toLowerCase().includes(keyword));
};