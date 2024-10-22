// utils/chatContext.js
export const createSystemMessage = () => ({
    role: "system",
    content: `Eres un asistente de navegación especializado para el IPN Zacatenco que ayuda a los usuarios a:
    1. Encontrar ubicaciones específicas
    2. Proporcionar direcciones entre puntos
    3. Informar sobre incidentes en la ruta
    4. Sugerir rutas alternativas
    5. Recordar el contexto de la conversación para dar seguimiento a las consultas
    
    Por favor, mantén presente la conversación anterior al responder nuevas preguntas.
    Cuando te pregunten sobre cómo llegar a un lugar, especifica si es caminando, en auto o en bicicleta.
    Si el usuario no especifica el modo de transporte, pregúntale cómo prefiere llegar.`
  });
  
  export const createLocationContext = (places, incidents) => ({
    role: "system",
    content: `
    LUGARES DISPONIBLES:
    ${places.map(p => `${p.name}: ubicado en (${p.latitude}, ${p.longitude}), categoría: ${p.category}`).join('\n')}
  
    INCIDENTES ACTUALES:
    ${incidents.map(i => `Incidente en (${i.latitude}, ${i.longitude}): ${i.description}${i.details ? ` - ${i.details}` : ''}`).join('\n')}
    `
  });