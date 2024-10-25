export const INTENT_TYPES = {
  REPORT_INCIDENT: 'REPORT_INCIDENT',
  VIEW_INCIDENTS: 'VIEW_INCIDENTS',
  NONE: 'NONE'
};

export const detectIntent = (message) => {
  const reportKeywords = [
    'reportar',
    'informar',
    'avisar',
    'nuevo incidente',
    'registrar incidente'
  ];

  const viewKeywords = [
    'ver incidentes',
    'mostrar incidentes',
    'incidentes cercanos',
    'que incidentes hay',
    'cuales son los incidentes'
  ];

  const lowerMessage = message.toLowerCase();

  if (reportKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return INTENT_TYPES.REPORT_INCIDENT;
  }

  if (viewKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return INTENT_TYPES.VIEW_INCIDENTS;
  }

  return INTENT_TYPES.NONE;
};

export const formatIncidentsList = (incidents, userLocation) => {
  if (!incidents || incidents.length === 0) {
    return "No hay incidentes reportados en este momento.";
  }

  let formattedList = "Incidentes actuales:\n\n";
  incidents.forEach((incident, index) => {
    const resolvedStatus = incident.resolved ? "✅ Resuelto" : "⚠️ Activo";
    formattedList += `${index + 1}. ${resolvedStatus}\n`;
    formattedList += `   Tipo: ${incident.description}\n`;
    if (incident.details) {
      formattedList += `   Detalles: ${incident.details}\n`;
    }
    formattedList += `   Reportado: ${new Date(incident.reportedAt).toLocaleString()}\n\n`;
  });

  return formattedList;
};