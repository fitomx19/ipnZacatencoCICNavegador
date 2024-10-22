// utils/incidentHandler.js
export const INCIDENT_TYPES = {
  COLLISION: 'collision',
  CONSTRUCTION: 'construction',
  CLOSURE: 'closure',
  FLOODING: 'flooding',
  OTHER: 'other'
};

export const isReportingIntent = (message) => {
  const reportKeywords = [
    'reportar',
    'informar',
    'avisar',
    'accidente',
    'incidente',
    'problema'
  ];
  return reportKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
};

export const extractIncidentDetails = (message) => {
  for (const [type, value] of Object.entries(INCIDENT_TYPES)) {
    if (message.toLowerCase().includes(value)) {
      return { type: value };
    }
  }
  return null;
};