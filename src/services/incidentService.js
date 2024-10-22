// services/incidentService.js
import { reportIncident } from '../api';

export const handleIncidentReport = async (userLocation, description, details) => {
  if (!userLocation?.latitude || !userLocation?.longitude) {
    throw new Error('Se requiere la ubicación para reportar un incidente');
  }

  try {
    const response = await reportIncident(
      userLocation.latitude,
      userLocation.longitude,
      description,
      details
    );
    return response;
  } catch (error) {
    console.error('Error al reportar incidente:', error);
    throw error;
  }
};
