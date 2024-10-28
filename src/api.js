// api/index.js
import axios from 'axios';
import { findClosestAddress } from '../src/utils/distance';

const ip = '192.168.100.16'
const API_URL = 'http://'+ip+':3000';

export const fetchPlaces = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/addresses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

export const fetchPlacesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/api/addresses/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching places for category ${category}:`, error);
    throw error;
  }
};

export const reportIncident = async (latitude, longitude, description = 'Incidente reportado', details = 'Hundimiento reportado') => {
  console.log('Reporting incident:', latitude, longitude, description, details);
  try {
    // Primero obtener todos los lugares para calcular el más cercano
    const places = await fetchPlaces();
    
    // Encontrar el lugar más cercano
    const closest_address = findClosestAddress(latitude, longitude, places);
    
    // Enviar el reporte incluyendo la dirección más cercana
    const response = await axios.post(`${API_URL}/api/incidents/report`, {
      latitude,
      longitude,
      description,
      details,
      closest_address // Nuevo campo que incluye el lugar más cercano
    });
    
    return response.data;
  } catch (error) {
    console.error('Error reporting incident:', error);
    throw error;
  }
};

export const fetchIncidents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/incidents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};