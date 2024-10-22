// utils/chatContextManager.js
export class ChatContextManager {
    constructor(initialContext = []) {
      this.context = initialContext;
      this.maxContextLength = 10; // Número máximo de mensajes en el contexto
      this.relevanceThreshold = 0.5; // Umbral para mantener mensajes relevantes
    }
  
    addMessage(message) {
      this.context.push(message);
      if (this.context.length > this.maxContextLength) {
        this.pruneContext();
      }
      return this.context;
    }
  
    pruneContext() {
      // Mantener el mensaje del sistema y los últimos mensajes más relevantes
      const systemMessage = this.context.find(msg => msg.role === 'system');
      const recentMessages = this.context.slice(-4); // Mantener los últimos 4 mensajes
      const otherMessages = this.context.slice(1, -4)
        .filter(msg => this.isMessageRelevant(msg));
  
      this.context = [
        systemMessage,
        ...otherMessages,
        ...recentMessages,
      ].filter(Boolean);
    }
  
    isMessageRelevant(message) {
      // Implementar lógica para determinar la relevancia del mensaje
      // Por ejemplo, buscar palabras clave sobre ubicaciones o incidentes
      const relevantKeywords = ['ubicación', 'llegar', 'ruta', 'incidente', 'dirección'];
      return relevantKeywords.some(keyword => 
        message.content.toLowerCase().includes(keyword)
      );
    }
  
    getContext() {
      return this.context;
    }
  
    clear() {
      this.context = this.context.filter(msg => msg.role === 'system');
      return this.context;
    }
  }