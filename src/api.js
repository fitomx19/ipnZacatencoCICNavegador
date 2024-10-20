import axios from 'axios';

const API_URL = 'http://192.168.10.102:3000'; // Replace with your actual backend URL

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


export const reportIncident = async (latitude, longitude, description = 'Incidente reportado' , details = 'Hundimiento reportado') => {
  console.log('Reporting incident:', latitude, longitude, description, details);
  try {
    const response = await axios.post(`${API_URL}/api/incidents/report`, {
      latitude,
      longitude,
      description,
      details
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
}