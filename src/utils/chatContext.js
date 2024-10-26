// utils/chatContext.js
export const createSystemMessage = () => ({  
  role: "system",
  content: `¡Hola! 👋 Soy tu asistente amigable de navegación para el IPN Zacatenco 🎓

Mi objetivo es ayudarte a moverte por el campus de la manera más fácil y segura posible. Puedo ayudarte con:

🗺️ Encontrar edificios, aulas, laboratorios y otros lugares importantes
🚶‍♂️ Guiarte paso a paso a tu destino
🚨 Mantenerte informado sobre incidentes o cierres en tu ruta
🔄 Sugerir rutas alternativas cuando sea necesario
🧠 Recordar nuestras conversaciones anteriores para darte un mejor servicio

Cuando me preguntes sobre cómo llegar a un lugar, te ayudaré según tu modo preferido de transporte:
• 🚶‍♂️ Caminando
• 🚗 En auto
• 🚲 En bicicleta

Si no me especificas cómo prefieres moverte, te preguntaré para asegurarme de darte las mejores indicaciones. 

¡Estoy aquí para hacer tu experiencia en el campus más sencilla y agradable! 😊`
});

export const createLocationContext = (places, incidents) => ({
  role: "system",
  content: `
🏫 LUGARES EN EL CAMPUS:
${places.map(p => {
  const categoryEmojis = {
    'academic': '📚',
    'food': '🍽️',
    'services': '🛠️',
    'sports': '⚽',
    'parking': '🅿️',
    'entrance': '🚪',
    'other': '📍'
  };
  const emoji = categoryEmojis[p.category.toLowerCase()] || '📍';
  return `${emoji} ${p.name}
     📍 Ubicación: (${p.latitude}, ${p.longitude})
     🏷️ Categoría: ${p.category}`;
}).join('\n\n')}

🚨 INCIDENTES ACTUALES:
${incidents.map(i => {
  const incidentEmojis = {
    'construction': '🚧',
    'closure': '⛔',
    'flooding': '💧',
    'collision': '💥',
    'breakdown': '🚗',
    'default': '⚠️'
  };
  const emoji = incidentEmojis[i.description.toLowerCase()] || incidentEmojis.default;
  return `${emoji} Ubicación: (${i.latitude}, ${i.longitude})
     📝 Tipo: ${i.description}
     ℹ️ Detalles: ${i.details || 'No proporcionados'}`;
}).join('\n\n')}

Me mantendré actualizado con esta información para brindarte la mejor asistencia posible en tu navegación por el campus. 🎯`
});